import {router, adminProcedure} from '../trpcServer';

const getAllRegisteredUsers = adminProcedure.query(async ({ctx}) => {
  const registeredUsers = await ctx.prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      events: {
        include: {
          eventSignUps: true,
        },
      },
    },
  });

  return registeredUsers;
});

export const adminRouter = router({
  getAllRegisteredUsers,
});
