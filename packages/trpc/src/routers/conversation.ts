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

    return await ctx.prisma.message.create({
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

  return await ctx.prisma.conversation.findMany({
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
      users: true,
      organizations: true,
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
        take: 1,
      },
    },
  });
});

export const conversationRouter = router({
  createConversation,
  getConversationById,
  getMyConversations,
  sendMessage,
});
