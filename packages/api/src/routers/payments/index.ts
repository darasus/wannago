import {createTRPCRouter} from '../../trpc';
import {createCheckoutSession} from './createCheckoutSession';
import {getCheckoutSession} from './getCheckoutSession';
import {getCurrency} from './getCurrency';

export const paymentsRouter = createTRPCRouter({
  createCheckoutSession,
  getCurrency,
  getCheckoutSession,
});
