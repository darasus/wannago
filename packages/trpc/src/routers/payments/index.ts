import {router} from '../../trpcServer';
import {createCheckoutSession} from './createCheckoutSession';
import {pollPurchasedTicket} from './pollPurchasedTicket';

export const paymentsRouter = router({
  createCheckoutSession,
  pollPurchasedTicket,
});
