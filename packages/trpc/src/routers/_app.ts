import {publicProcedure, router} from '../trpcServer';
import {mailRouter} from './mail';
import {eventRouter} from './event';
import {mapsRouter} from './maps';
import {meRouter} from './me';
import {adminRouter} from './admin';
import {userRouter} from './user';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  event: eventRouter,
  maps: mapsRouter,
  mail: mailRouter,
  me: meRouter,
  admin: adminRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
