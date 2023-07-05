import {z} from 'zod';
import {createTRPCRouter, protectedProcedure, publicProcedure} from '../trpc';
import {getUserByExternalId as _getUserByExternalId} from '../actions/getUserByExternalId';
import {getUserById as _getUserById} from '../actions/getUserById';

const getUserById = publicProcedure
  .input(z.object({userId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return _getUserById(ctx)({
      id: input.userId,
    });
  });

const getUserByExternalId = publicProcedure
  .input(z.object({externalId: z.string()}))
  .query(async ({ctx, input}) => {
    return _getUserByExternalId(ctx)({
      externalId: input.externalId,
    });
  });

const me = publicProcedure.query(async ({ctx}) => {
  console.log('>>> ctx', ctx.auth?.userId);
  if (!ctx.auth?.userId) {
    return null;
  }

  return _getUserByExternalId(ctx)({
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

export const userRouter = createTRPCRouter({
  getUserById,
  getUserByExternalId,
  me,
  update,
});
