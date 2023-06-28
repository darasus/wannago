import {createTRPCRouter} from './trpc';
import {subscriptionRouter} from './routers/subscription';
import {paymentsRouter} from './routers/payments';
import {stripeAccountLinkRouter} from './routers/stripeAccountLink';

export const lambdaRouter = createTRPCRouter({
  subscriptionPlan: subscriptionRouter,
  payments: paymentsRouter,
  stripeAccountLink: stripeAccountLinkRouter,
});
