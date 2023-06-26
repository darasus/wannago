import {router} from '../trpc';
import {mailRouter} from './mail';
import {eventRouter} from './event';
import {mapsRouter} from './maps';
import {adminRouter} from './admin';
import {userRouter} from './user';
import {organizationRouter} from './organization';
import {subscriptionRouter} from './subscription';
import {conversationRouter} from './conversation';
import {followRouter} from './follow';
import {paymentsRouter} from './payments';
import {stripeAccountLinkRouter} from './stripeAccountLink';

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
  follow: followRouter,
  payments: paymentsRouter,
  stripeAccountLink: stripeAccountLinkRouter,
});
