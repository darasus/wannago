import {router, adminProcedure} from '../trpc';

const getAllRegisteredUsers = adminProcedure.query(async ({ctx}) => {
  const registeredUsers = await ctx.prisma.user.findMany({
    where: {
      externalId: {
        not: null,
      },
    },
    include: {
      organization: {
        include: {
          events: true,
        },
      },
    },
  });

  return registeredUsers;
});

export const adminRouter = router({
  getAllRegisteredUsers,
});
