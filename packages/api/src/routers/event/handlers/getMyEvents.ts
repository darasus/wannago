import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

export const getMyEvents = protectedProcedure
  .input(
    z.object({
      onlyPast: z.boolean().optional(),
    })
  )
  .query(async ({ctx, input}) => {
    return ctx.actions.getEvents({
      onlyPast: input.onlyPast,
    });
  });
