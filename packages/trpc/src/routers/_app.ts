import {router} from '../trpcServer';
import {mailRouter} from './mail';
import {eventRouter} from './event';
import {mapsRouter} from './maps';
import {adminRouter} from './admin';
import {userRouter} from './user';
import {organizationRouter} from './organization';
import {sessionRouter} from './session';
import {subscriptionRouter} from './subscription';
import {conversationRouter} from './conversation';

export const appRouter = router({
  event: eventRouter,
  maps: mapsRouter,
  mail: mailRouter,
  admin: adminRouter,
  user: userRouter,
  organization: organizationRouter,
  session: sessionRouter,
  subscription: subscriptionRouter,
  conversation: conversationRouter,
});

export type AppRouter = typeof appRouter;
