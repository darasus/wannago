import {createTRPCRouter, protectedProcedure} from '../trpc';
import {z} from 'zod';
import {env} from 'client-env';

const searchPlaces = protectedProcedure
  .input(
    z.object({
      query: z.string(),
    })
  )
  .query(async ({input, ctx}) => {
    const result = await ctx.googleMaps.placeAutocomplete({
      params: {
        key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        input: input.query,
      },
    });

    return result.data;
  });

const getGeolocation = protectedProcedure
  .input(z.object({address: z.string()}))
  .query(async ({ctx, input}) => {
    const result = await ctx.googleMaps.geocode({
      params: {
        key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        address: input.address,
      },
    });

    return result.data;
  });

export const mapsRouter = createTRPCRouter({
  searchPlaces,
  getGeolocation,
});
