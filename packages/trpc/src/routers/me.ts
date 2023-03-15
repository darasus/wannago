import {router, protectedProcedure} from '../trpcServer';

const getMyEvents = protectedProcedure.query(async ({ctx}) => {
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
