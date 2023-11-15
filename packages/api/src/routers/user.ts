import {z} from 'zod';
import {createTRPCRouter, protectedProcedure, publicProcedure} from '../trpc';
import {getUserById as _getUserById} from '../actions/getUserById';
import {getPageSession} from 'auth';

const getUserById = publicProcedure
  .input(z.object({userId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return _getUserById(ctx)({
      id: input.userId,
    });
  });

const me = publicProcedure.query(async ({ctx}) => {
  const session = await getPageSession();

  if (!ctx.auth?.user?.id || !session) {
    return null;
  }

  return _getUserById(ctx)({
    id: ctx.auth?.user?.id,
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
        preferredCurrency: input.currency || 'USD',
      },
    });
  });

const getMyTickets = protectedProcedure.query(async ({ctx, input}) => {
  return ctx.prisma.ticketSale.findMany({
    where: {
      user: {
        id: ctx.auth?.user?.id,
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
  me,
  update,
  getMyTickets,
});
