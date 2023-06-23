import {createTRPCRouter} from './trpc';
import {eventRouter} from 'trpc/src/routers/event';
import {mapsRouter} from 'trpc/src/routers/maps';
import {mailRouter} from 'trpc/src/routers/mail';
import {adminRouter} from 'trpc/src/routers/admin';
import {userRouter} from 'trpc/src/routers/user';
import {organizationRouter} from 'trpc/src/routers/organization';
import {sessionRouter} from 'trpc/src/routers/session';
import {subscriptionRouter} from 'trpc/src/routers/subscription';
import {conversationRouter} from 'trpc/src/routers/conversation';
import {followRouter} from 'trpc/src/routers/follow';
import {paymentsRouter} from 'trpc/src/routers/payments';
import {stripeAccountLinkRouter} from 'trpc/src/routers/stripeAccountLink';

// Deployed to /trpc/edge/**
export const edgeRouter = createTRPCRouter({
  event: eventRouter,
  maps: mapsRouter,
  mail: mailRouter,
  admin: adminRouter,
  user: userRouter,
  organization: organizationRouter,
  session: sessionRouter,
  subscriptionPlan: subscriptionRouter,
  follow: followRouter,
  payments: paymentsRouter,
  stripeAccountLink: stripeAccountLinkRouter,
  conversation: conversationRouter,
});
