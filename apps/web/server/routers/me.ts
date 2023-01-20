import {router, protectedProcedure} from '../trpc';

const getMyEvents = protectedProcedure.query(async ({ctx}) => {
  const events = await ctx.prisma.event.findMany({
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

  return {events};
});

export const meRouter = router({
  getMyEvents,
});
