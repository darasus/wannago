import {z} from 'zod';
import {createTRPCRouter, protectedProcedure, publicProcedure} from '../trpc';
import {getUserByExternalId as _getUserByExternalId} from '../actions/getUserByExternalId';

const getUserById = publicProcedure
  .input(z.object({userId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.db
      .selectFrom('User')
      .where('id', '=', input.userId)
      .select(['firstName', 'lastName', 'profileImageSrc', 'preferredCurrency'])
      .executeTakeFirst();
  });

const getUserByExternalId = publicProcedure
  .input(z.object({externalId: z.string()}))
  .query(async ({ctx, input}) => {
    return _getUserByExternalId(ctx)({
      externalId: input.externalId,
    });
  });

const me = publicProcedure.query(async ({ctx}) => {
  if (!ctx.auth?.userId) {
    return null;
  }

  const result = await ctx.db
    .selectFrom('User')
    .where('externalId', '=', ctx.auth?.userId)
    .selectAll()
    .executeTakeFirst();

  return result || null;
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
    await ctx.db
      .updateTable('User')
      .set({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        profileImageSrc: input.profileImageSrc,
        preferredCurrency: input.currency,
      })
      .where('id', '=', input.userId)
      .executeTakeFirst();

    return null;
  });

const getMyTickets = protectedProcedure.query(async ({ctx, input}) => {
  return ctx.prisma.ticketSale.findMany({
    where: {
      user: {
        externalId: ctx.auth.userId,
      },
    },
    include: {
      event: true,
      ticket: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
});

export const userRouter = createTRPCRouter({
  getUserById,
  getUserByExternalId,
  me,
  update,
  getMyTickets,
});
