import {z} from 'zod';
import {publicProcedure} from '../../../trpcServer';

export const getPublicEvents = publicProcedure
  .input(z.object({id: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.actions.getEvents({
      id: input.id,
      isPublished: true,
      eventType: 'organizing',
    });
  });
