import {publicProcedure} from '../../../trpc';
import {Listing} from '@prisma/client';

export const getPublicEvents = publicProcedure.query(async ({ctx}) => {
  return ctx.actions.getEvents({
    isPublished: true,
    orderByStartDate: 'desc',
    listing: Listing.LISTED,
  });
});
