import {isBefore} from 'date-fns';
import {conversationNotFoundError, userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {createTRPCRouter, protectedProcedure} from '../trpc';

const createConversation = protectedProcedure
  .input(
    z.object({
      userIds: z.array(z.string().uuid()),
      organizationId: z.string().uuid().optional(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const existingConversation = await ctx.prisma.conversation.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: input.userIds,
            },
          },
        },
        organizations: {
          every: {
            id: input.organizationId,
          },
        },
      },
      include: {
        users: true,
        organizations: true,
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    const conversation = await ctx.prisma.conversation.create({
      data: {
        ...(input.userIds.length > 0
          ? {
              users: {
                connect: input.userIds.map((id) => ({id})),
              },
            }
          : {}),
        organizations: {
          connect: {
            id: input.organizationId,
          },
        },
      },
      include: {
        users: true,
        organizations: true,
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
            user: {
              include: {
                organizations: true,
              },
            },
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
  const user = await ctx.prisma.user.findFirst({
    where: {
      id: ctx.auth?.user?.id,
    },
    include: {
      organizations: true,
    },
  });

  invariant(user, userNotFoundError);

  const conversations = await ctx.prisma.conversation.findMany({
    where: {
      OR: [
        {
          users: {
            some: {
              id: user.id,
            },
          },
        },
        ...(user?.organizations?.map((o) => ({
          organizations: {
            some: {
              id: o.id,
            },
          },
        })) || []),
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

  return conversations.map((c) => {
    const lastSeen = c.lastSeen?.find((ls) => {
      return ls.userId === user?.id;
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
  const user = await ctx.prisma.user.findFirst({
    where: {
      id: ctx.auth?.user?.id,
    },
    include: {
      organizations: true,
    },
  });

  const conversations = await ctx.prisma.conversation.findMany({
    where: {
      users: {
        some: {
          id: user?.id,
        },
      },
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
      userId: user?.id,
    },
    orderBy: {
      lastSeen: 'desc',
    },
  });

  if (!lastSeen) {
    return true;
  }

  const hasUnseen = conversations.some((conversation) => {
    return conversation.messages.some((message) => {
      if (message.user?.id && user?.id && message.user?.id === user?.id) {
        return false;
      }

      if (
        message.organization?.id &&
        user?.organizations.some((o) => o.id === message.organization?.id)
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
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.auth?.user?.id,
      },
    });
    const conversationLastSeen =
      await ctx.prisma.conversationLastSeen.findFirst({
        where: {
          conversationId: input.conversationId,
          userId: user?.id,
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
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
    }
  });

export const conversationRouter = createTRPCRouter({
  createConversation,
  getConversationById,
  getMyConversations,
  sendMessage,
  getUserHasUnseenConversation,
  markConversationAsSeen,
});
