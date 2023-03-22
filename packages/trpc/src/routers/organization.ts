import {TRPCError} from '@trpc/server';
import {z} from 'zod';
import {router, protectedProcedure, publicProcedure} from '../trpcServer';

const getOrganizationProfileEvents = publicProcedure
  .input(z.object({organizationId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.prisma.event.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        isPublished: true,
        organization: {
          id: input.organizationId,
        },
      },
    });
  });

const getOrganizationById = publicProcedure
  .input(z.object({organizationId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.prisma.organization.findFirst({
      where: {
        id: input.organizationId,
      },
    });
  });

const getOrganizationByExternalId = publicProcedure
  .input(z.object({externalId: z.string()}))
  .query(async ({ctx, input}) => {
    console.log('getOrganizationByExternalId', input);
    return ctx.prisma.organization.findFirst({
      where: {
        externalId: input.externalId,
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

export const organizationRouter = router({
  getOrganizationProfileEvents,
  getOrganizationById,
  getMyEvents,
  getOrganizationByExternalId,
});
