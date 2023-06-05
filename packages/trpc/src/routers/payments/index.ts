import {router} from '../../trpcServer';
import {createCheckoutSession} from './createCheckoutSession';
import {getCurrency} from './getCurrency';

export const paymentsRouter = router({
  createCheckoutSession,
  getCurrency,
});
