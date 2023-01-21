import {router, protectedProcedure} from '../trpc';

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
  return ctx.prisma.user.findUnique({
    where: {
      email: ctx.user?.emailAddresses[0].emailAddress,
    },
  });
});

export const meRouter = router({
  getMyEvents,
  me,
});
