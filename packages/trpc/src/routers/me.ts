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
                email: {
                  in: ctx.user?.emailAddresses.map(e => e.emailAddress),
                },
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
                externalId: ctx.user?.id,
              },
            },
          },
        },
      });
    }

    if (input.eventType === 'all') {
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
                    externalId: ctx.user?.id,
                  },
                },
              },
            },
            {
              eventSignUps: {
                some: {
                  user: {
                    email: {
                      in: ctx.user?.emailAddresses.map(e => e.emailAddress),
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
      externalId: ctx.user?.id,
    },
  });
});

export const meRouter = router({
  getMyEvents,
  me,
});
