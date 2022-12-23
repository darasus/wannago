import {router, protectedProcedure} from '../trpc';
import {Client} from '@googlemaps/google-maps-services-js';
import {z} from 'zod';

const searchPlaces = protectedProcedure
  .input(
    z.object({
      query: z.string(),
    })
  )
  .query(async ({input, ctx}) => {
    const response = await ctx.maps.suggestPlace(input);

    return response;
  });

export const mapsRouter = router({
  searchPlaces,
});
