import {z} from 'zod';
import {router, protectedProcedure} from '../trpcServer';

const getUserProfileEvents = protectedProcedure
  .input(z.object({userId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.prisma.event.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        isPublished: true,
        organization: {
          users: {
            some: {
              id: input.userId,
            },
          },
        },
      },
    });
  });

const getUserById = protectedProcedure
  .input(z.object({userId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: input.userId,
      },
    });
  });

export const userRouter = router({
  getUserProfileEvents,
  getUserById,
});
