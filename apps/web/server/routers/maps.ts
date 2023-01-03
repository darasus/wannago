import {router, protectedProcedure} from '../trpc';
import {z} from 'zod';

const searchPlaces = protectedProcedure
  .input(
    z.object({
      query: z.string(),
    })
  )
  .query(async ({input, ctx}) => {
    return ctx.maps.suggestPlaces(input);
  });

const getGeolocation = protectedProcedure
  .input(z.object({address: z.string()}))
  .query(async ({ctx, input}) => {
    return ctx.maps.geocode({address: input.address});
  });

export const mapsRouter = router({
  searchPlaces,
  getGeolocation,
});
