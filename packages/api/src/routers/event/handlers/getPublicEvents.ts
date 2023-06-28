import {z} from 'zod';
import {publicProcedure} from '../../../trpc';
import {getEvents} from '../../../actions/getEvents';

export const getPublicEvents = publicProcedure
  .input(z.object({id: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return getEvents(ctx)({
      authorIds: [input.id],
      isPublished: true,
      eventType: 'organizing',
    });
  });
