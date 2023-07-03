import {createTRPCRouter} from './trpc';
import {paymentsRouter} from './routers/payments';
import {stripeAccountLinkRouter} from './routers/stripeAccountLink';

export const lambdaRouter = createTRPCRouter({
  payments: paymentsRouter,
  stripeAccountLink: stripeAccountLinkRouter,
});
