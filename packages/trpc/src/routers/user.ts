import {z} from 'zod';
import {router, protectedProcedure, publicProcedure} from '../trpcServer';

const getUserProfileEvents = publicProcedure
  .input(z.object({userId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.prisma.event.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        isPublished: true,
        organization: {
          users: {
            some: {
              id: input.userId,
            },
          },
        },
      },
    });
  });

const getUserById = publicProcedure
  .input(z.object({userId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: input.userId,
      },
    });
  });

const getMyEvents = protectedProcedure
  .input(
    z.object({
      eventType: z.enum(['attending', 'organizing', 'all']),
    })
  )
  .query(async ({ctx, input}) => {
    if (input.eventType === 'attending') {
      return ctx.prisma.event.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          eventSignUps: {
            some: {
              user: {
                externalId: ctx.auth.userId,
              },
            },
          },
        },
      });
    }

    if (input.eventType === 'organizing') {
      return ctx.prisma.event.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          organization: {
            users: {
              some: {
                externalId: ctx.auth.userId,
              },
            },
          },
        },
      });
    }

    if (input.eventType === 'all') {
      const emailAddresses = await ctx.clerk.users
        .getUser(ctx.auth.userId)
        .then(res => res.emailAddresses.map(e => e.emailAddress));

      return ctx.prisma.event.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          OR: [
            {
              organization: {
                users: {
                  some: {
                    externalId: ctx.auth.userId,
                  },
                },
              },
            },
            {
              eventSignUps: {
                some: {
                  user: {
                    email: {
                      in: emailAddresses,
                    },
                  },
                },
              },
            },
          ],
        },
      });
    }

    return [];
  });

const me = protectedProcedure.query(async ({ctx}) => {
  return ctx.prisma.user.findFirst({
    where: {
      externalId: ctx.auth.userId,
    },
  });
});

export const userRouter = router({
  getUserProfileEvents,
  getUserById,
  getMyEvents,
  me,
});
