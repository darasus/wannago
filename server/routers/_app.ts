import {publicProcedure, router} from '../trpc';
import {emailRouter} from './email';
import {eventRouter} from './event';
import {eventManagerRouter} from './eventManager';
import {mapsRouter} from './maps';
import {meRouter} from './me';
import {userRouter} from './user';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  event: eventRouter,
  eventManager: eventManagerRouter,
  maps: mapsRouter,
  mailgun: emailRouter,
  user: userRouter,
  me: meRouter,
});

export type AppRouter = typeof appRouter;
