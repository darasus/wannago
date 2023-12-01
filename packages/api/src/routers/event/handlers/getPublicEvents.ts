import {z} from 'zod';
import {publicProcedure} from '../../../trpc';
import {Listing} from '@prisma/client';

export const getPublicEvents = publicProcedure
  .input(z.object({id: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.actions.getEvents({
      authorIds: [input.id],
      isPublished: true,
      eventType: 'organizing',
      orderByStartDate: 'desc',
      listing: Listing.LISTED,
    });
  });
