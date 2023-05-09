import {router} from '../../trpcServer';
import {createAccountLink} from './createAccountLink';
import {getAccount} from './getAccount';
import {getAccountLink} from './getAccountLink';
import {deleteAccountLink} from './deleteAccountLink';

export const stripeAccountLinkRouter = router({
  createAccountLink,
  getAccount,
  getAccountLink,
  deleteAccountLink,
});
