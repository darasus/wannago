import {publicProcedure, router} from '../trpc';
import {mailRouter} from './mail';
import {eventRouter} from './event';
import {mapsRouter} from './maps';
import {meRouter} from './me';
import {adminRouter} from './admin';
import {emailRouter} from './email';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  event: eventRouter,
  maps: mapsRouter,
  mail: mailRouter,
  me: meRouter,
  admin: adminRouter,
  email: emailRouter,
});

export type AppRouter = typeof appRouter;
