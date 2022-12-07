import {router, protectedProcedure} from '../trpc';

export const meRouter = router({
  getMyEvents: protectedProcedure.query(async ({ctx}) => {
    const events = await ctx.prisma.event.findMany({
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

    return {events};
  }),
});
