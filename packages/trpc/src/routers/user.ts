import {z} from 'zod';
import {router, protectedProcedure, publicProcedure} from '../trpcServer';

const getUserById = publicProcedure
  .input(z.object({userId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.actions.getUserById({
      id: input.userId,
    });
  });

const me = publicProcedure.query(async ({ctx}) => {
  if (!ctx.auth?.userId) {
    return null;
  }

  return ctx.actions.getUserByExternalId({
    externalId: ctx.auth.userId,
  });
});

const update = protectedProcedure
  .input(
    z.object({
      userId: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      profileImageSrc: z.string().nullable(),
      currency: z.enum(['USD', 'EUR', 'GBP']),
    })
  )
  .mutation(async ({ctx, input}) => {
    return ctx.prisma.user.update({
      where: {
        id: input.userId,
      },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        profileImageSrc: input.profileImageSrc,
        preferredCurrency: input.currency,
      },
    });
  });

export const userRouter = router({
  getUserById,
  me,
  update,
});
