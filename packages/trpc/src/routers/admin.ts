import {router, adminProcedure} from '../trpcServer';

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
          events: {
            orderBy: {createdAt: 'desc'},
            include: {
              eventSignUps: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return registeredUsers;
});

export const adminRouter = router({
  getAllRegisteredUsers,
});
