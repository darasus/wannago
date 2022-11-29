import {publicProcedure, router} from '../trpc';
import {eventRouter} from './event';
import {mapsRouter} from './maps';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  event: eventRouter,
  maps: mapsRouter,
});

export type AppRouter = typeof appRouter;
