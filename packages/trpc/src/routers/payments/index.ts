import {router} from '../../trpcServer';
import {createCheckoutSession} from './createCheckoutSession';

export const paymentsRouter = router({
  createCheckoutSession,
});
