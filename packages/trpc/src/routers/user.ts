import {TRPCError} from '@trpc/server';
import {z} from 'zod';
import {router, protectedProcedure, publicProcedure} from '../trpcServer';

const getPublicUserEvents = publicProcedure
  .input(z.object({userId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.actions.getEvents({
      id: input.userId,
      isPublished: true,
      eventType: 'organizing',
    });
  });

const getUserById = publicProcedure
  .input(z.object({userId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.actions.getUserById({
      id: input.userId,
    });
  });

const getMyEvents = protectedProcedure
  .input(
    z.object({
      eventType: z.enum(['attending', 'organizing', 'all']),
    })
  )
  .query(async ({ctx, input}) => {
    const user = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth.userId,
    });

    return ctx.actions.getEvents({
      id: user?.id,
      eventType: input.eventType,
    });
  });

const me = protectedProcedure.query(async ({ctx}) => {
  return ctx.actions.getUserByExternalId({
    externalId: ctx.auth.userId,
  });
});

export const userRouter = router({
  getPublicUserEvents,
  getUserById,
  getMyEvents,
  me,
});
