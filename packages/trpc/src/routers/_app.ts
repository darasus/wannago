import {publicProcedure, router} from '../trpcServer';
import {mailRouter} from './mail';
import {eventRouter} from './event';
import {mapsRouter} from './maps';
import {adminRouter} from './admin';
import {userRouter} from './user';
import {organizationRouter} from './organization';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  event: eventRouter,
  maps: mapsRouter,
  mail: mailRouter,
  admin: adminRouter,
  user: userRouter,
  organization: organizationRouter,
});

export type AppRouter = typeof appRouter;
