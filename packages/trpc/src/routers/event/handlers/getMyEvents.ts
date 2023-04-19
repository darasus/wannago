import {z} from 'zod';
import {publicProcedure} from '../../../trpcServer';

export const getMyEvents = publicProcedure
  .input(
    z.object({
      organizerId: z.string().uuid(),
      onlyPast: z.boolean().optional(),
      eventType: z.enum(['attending', 'organizing', 'following', 'all']),
    })
  )
  .query(async ({ctx, input}) => {
    if (!ctx.auth?.userId) {
      return null;
    }

    return ctx.actions.getEvents({
      id: input.organizerId,
      eventType: input.eventType,
      onlyPast: input.onlyPast,
    });
  });
