import {publicProcedure, router} from '../trpc';
import {emailRouter} from './email';
import {eventRouter} from './event';
import {mapsRouter} from './maps';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  event: eventRouter,
  maps: mapsRouter,
  mailgun: emailRouter,
});

export type AppRouter = typeof appRouter;
