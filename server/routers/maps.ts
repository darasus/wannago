import {router, protectedProcedure} from '../trpc';
import {Client} from '@googlemaps/google-maps-services-js';

import {z} from 'zod';
import {prisma} from '../../lib/prisma';
import {getFetch} from '@trpc/client';

export const mapsRouter = router({
  searchPlaces: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({input}) => {
      //   const url = new URL(
      //     'https://maps.googleapis.com/maps/api/place/autocomplete/json'
      //   );

      //   url.searchParams.append('input', input.query);
      //   url.searchParams.append(
      //     'key',
      //     process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
      //   );

      //   const fetch = getFetch();

      //   return fetch(url).then(res => res.json());

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
