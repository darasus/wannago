import {createTRPCRouter} from './trpc';
import {eventRouter} from './routers/event';
import {mapsRouter} from './routers/maps';
import {mailRouter} from './routers/mail';
import {adminRouter} from './routers/admin';
import {userRouter} from './routers/user';
import {organizationRouter} from './routers/organization';
import {subscriptionRouter} from './routers/subscription';
import {conversationRouter} from './routers/conversation';
import {followRouter} from './routers/follow';
import {paymentsRouter} from './routers/payments';
import {stripeAccountLinkRouter} from './routers/stripeAccountLink';

// Deployed to /trpc/edge/**
export const edgeRouter = createTRPCRouter({
  event: eventRouter,
  maps: mapsRouter,
  mail: mailRouter,
  admin: adminRouter,
  user: userRouter,
  organization: organizationRouter,
  subscriptionPlan: subscriptionRouter,
  follow: followRouter,
  payments: paymentsRouter,
  stripeAccountLink: stripeAccountLinkRouter,
  conversation: conversationRouter,
});
