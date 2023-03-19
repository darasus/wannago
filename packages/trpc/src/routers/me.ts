import {z} from 'zod';
import {router, protectedProcedure, publicProcedure} from '../trpcServer';

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

export const meRouter = router({
  getMyEvents,
  me,
});
