import {createTRPCRouter} from './trpc';
import {mapsRouter} from './routers/maps';
import {subscriptionRouter} from './routers/subscription';
import {paymentsRouter} from './routers/payments';
import {stripeAccountLinkRouter} from './routers/stripeAccountLink';

export const lambdaRouter = createTRPCRouter({
  maps: mapsRouter,
  subscriptionPlan: subscriptionRouter,
  payments: paymentsRouter,
  stripeAccountLink: stripeAccountLinkRouter,
});
