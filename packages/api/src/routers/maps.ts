import {createTRPCRouter, protectedProcedure} from '../trpc';
import {z} from 'zod';
import {geocode, placeAutocomplete} from 'utils';

const searchPlaces = protectedProcedure
  .input(
    z.object({
      query: z.string(),
    })
  )
  .query(async ({input, ctx}) => {
    const result = await placeAutocomplete(input.query);

    return result.data;
  });

const getGeolocation = protectedProcedure
  .input(z.object({address: z.string()}))
  .query(async ({ctx, input}) => {
    const result = await geocode(input.address);

    return result.data;
  });

export const mapsRouter = createTRPCRouter({
  searchPlaces,
  getGeolocation,
});
