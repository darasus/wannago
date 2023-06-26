import {createTRPCRouter} from '../../trpc';
import {createCheckoutSession} from './createCheckoutSession';
import {getCurrency} from './getCurrency';

export const paymentsRouter = createTRPCRouter({
  createCheckoutSession,
  getCurrency,
});
