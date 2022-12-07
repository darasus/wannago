import {publicProcedure, router} from '../trpc';
import {emailRouter} from './email';
import {eventRouter} from './event';
import {mapsRouter} from './maps';
import {userRouter} from './user';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  event: eventRouter,
  maps: mapsRouter,
  mailgun: emailRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
