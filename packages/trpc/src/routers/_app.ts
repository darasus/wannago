import {publicProcedure, router} from '../trpcServer';
import {mailRouter} from './mail';
import {eventRouter} from './event';
import {mapsRouter} from './maps';
import {adminRouter} from './admin';
import {userRouter} from './user';
import {organizationRouter} from './organization';
import {sessionRouter} from './session';
import {createContext} from '../context';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  event: eventRouter,
  maps: mapsRouter,
  mail: mailRouter,
  admin: adminRouter,
  user: userRouter,
  organization: organizationRouter,
  session: sessionRouter,
});

export type AppRouter = typeof appRouter;
