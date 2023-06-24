import {isBefore} from 'date-fns';
import {conversationNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {router, protectedProcedure} from '../trpcServer';

const createConversation = protectedProcedure
  .input(
    z.object({
      userIds: z.array(z.string().uuid()),
      organizationIds: z.array(z.string().uuid()),
    })
  )
  .mutation(async ({ctx, input}) => {
    const existingConversation = await ctx.prisma.conversation.findFirst({
      where: {
        users: {
          every: {
            id: {in: input.userIds},
          },
        },
        organizations: {
          every: {
            id: {in: input.organizationIds},
          },
        },
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    const conversation = await ctx.prisma.conversation.create({
      data: {
        users: {
          connect: input.userIds.map(id => ({id})),
        },
        organizations: {
          connect: input.organizationIds.map(id => ({id})),
        },
      },
    });

    return conversation;
  });

const getConversationById = protectedProcedure
  .input(
    z.object({
      conversationId: z.string().uuid(),
    })
  )
  .query(async ({ctx, input}) => {
    const conversation = await ctx.prisma.conversation.findFirst({
      where: {
        id: input.conversationId,
      },
      include: {
        users: true,
        organizations: true,
        messages: {
          include: {
            organization: true,
            user: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    invariant(conversation, conversationNotFoundError);

    return conversation;
  });

const sendMessage = protectedProcedure
  .input(
    z.object({
      senderId: z.string().uuid(),
      conversationId: z.string().uuid(),
      text: z.string(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const [user, organization] = await Promise.all([
      ctx.prisma.user.findUnique({
        where: {
          id: input.senderId,
        },
      }),
      ctx.prisma.organization.findUnique({
        where: {
          id: input.senderId,
        },
      }),
    ]);

    const message = await await ctx.prisma.message.create({
      data: {
        text: input.text,
        conversation: {
          connect: {
            id: input.conversationId,
          },
        },
        ...(!!user ? {user: {connect: {id: input.senderId}}} : {}),
        ...(!!organization
          ? {organization: {connect: {id: input.senderId}}}
          : {}),
      },
    });

    const conversationLastSeen =
      await ctx.prisma.conversationLastSeen.findFirst({
        where: {
          conversationId: input.conversationId,
          userId: input.senderId,
        },
      });

    await ctx.prisma.conversationLastSeen.update({
      where: {
        id: conversationLastSeen?.id,
      },
      data: {
        lastSeen: new Date(),
      },
    });

    return message;
  });

const getMyConversations = protectedProcedure.query(async ({ctx}) => {
  const activeSessionType = await ctx.actions.getActiveSessionType();
  const user = await ctx.prisma.user.findFirst({
    where: {
      externalId: ctx.auth?.userId,
    },
    include: {
      organization: true,
    },
  });

  const conversations = await ctx.prisma.conversation.findMany({
    where: {
      OR: [
        {
          users: {
            some: {
              id: user?.id,
            },
          },
        },
        {
          organizations: {
            some: {
              id: user?.organization?.id,
            },
          },
        },
      ],
    },
    include: {
      users: true,
      organizations: true,
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
      lastSeen: true,
    },
  });

  return conversations.map(c => {
    const lastSeen = c.lastSeen?.find(ls => {
      if (activeSessionType === 'user') {
        return ls.userId === user?.id;
      }
      if (activeSessionType === 'organization') {
        return ls.organizationId === user?.organization?.id;
      }

      return false;
    });

    return {
      ...c,
      hasUnseenMessages: c.messages?.[0]?.createdAt
        ? lastSeen
          ? isBefore(lastSeen.lastSeen, c.messages[0].createdAt)
          : true
        : null,
    };
  });
});

const getUserHasUnseenConversation = protectedProcedure.query(async ({ctx}) => {
  const activeSessionType = await ctx.actions.getActiveSessionType();
  const user = await ctx.prisma.user.findFirst({
    where: {
      externalId: ctx.auth?.userId,
    },
    include: {
      organization: true,
    },
  });

  const conversations = await ctx.prisma.conversation.findMany({
    where: {
      ...(activeSessionType === 'user'
        ? {
            users: {
              some: {
                id: user?.id,
              },
            },
          }
        : {}),
      ...(activeSessionType === 'organization'
        ? {
            organizations: {
              some: {
                id: user?.organization?.id,
              },
            },
          }
        : {}),
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        include: {
          user: true,
          organization: true,
        },
      },
    },
  });

  if (conversations.length === 0) {
    return false;
  }

  const lastSeen = await ctx.prisma.conversationLastSeen.findFirst({
    where: {
      ...(activeSessionType === 'organization'
        ? {organizationId: user?.organization?.id}
        : {}),
      ...(activeSessionType === 'user' ? {userId: user?.id} : {}),
    },
  });

  if (!lastSeen) {
    return true;
  }

  const hasUnseen = conversations.some(conversation => {
    return conversation.messages.some(message => {
      if (
        message.user?.id === user?.id ||
        message.organization?.id === user?.organization?.id
      ) {
        return false;
      }
      if (lastSeen?.lastSeen) {
        return isBefore(lastSeen?.lastSeen, message.createdAt);
      }

      return false;
    });
  });

  return hasUnseen;
});

const markConversationAsSeen = protectedProcedure
  .input(
    z.object({
      conversationId: z.string().uuid(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const activeSessionType = await ctx.actions.getActiveSessionType();
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth?.userId,
      },
      include: {
        organization: true,
      },
    });
    const conversationLastSeen =
      await ctx.prisma.conversationLastSeen.findFirst({
        where: {
          conversationId: input.conversationId,
          ...(activeSessionType === 'user' ? {userId: user?.id} : {}),
          ...(activeSessionType === 'organization'
            ? {organizationId: user?.organization?.id}
            : {}),
        },
      });

    if (conversationLastSeen) {
      return await ctx.prisma.conversationLastSeen.update({
        where: {
          id: conversationLastSeen.id,
        },
        data: {
          lastSeen: new Date(),
        },
      });
    } else {
      return await ctx.prisma.conversationLastSeen.create({
        data: {
          conversation: {
            connect: {
              id: input.conversationId,
            },
          },
          lastSeen: new Date(),
          ...(activeSessionType === 'user'
            ? {
                user: {
                  connect: {
                    id: user?.id,
                  },
                },
              }
            : {}),
          ...(activeSessionType === 'organization'
            ? {
                organization: {
                  connect: {
                    id: user?.organization?.id,
                  },
                },
              }
            : {}),
        },
      });
    }
  });

export const conversationRouter = router({
  createConversation,
  getConversationById,
  getMyConversations,
  sendMessage,
  getUserHasUnseenConversation,
  markConversationAsSeen,
});
