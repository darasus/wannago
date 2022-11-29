import {router, protectedProcedure} from '../trpc';
import {Client} from '@googlemaps/google-maps-services-js';
import {z} from 'zod';

export const mapsRouter = router({
  searchPlaces: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({input}) => {
      const client = new Client();

      const response = await client.placeAutocomplete({
        params: {
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          input: input.query,
        },
      });

      return response.data;
    }),
});
