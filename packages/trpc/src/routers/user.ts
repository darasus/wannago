import {z} from 'zod';
import {router, protectedProcedure, publicProcedure} from '../trpcServer';

const getUserById = publicProcedure
  .input(z.object({userId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.actions.getUserById({
      id: input.userId,
    });
  });

const me = protectedProcedure.query(async ({ctx}) => {
  return ctx.actions.getUserByExternalId({
    externalId: ctx.auth.userId,
  });
});

export const userRouter = router({
  getUserById,
  me,
});
