import {router} from '../../trpcServer';
import {createAccountLink} from './createAccountLink';
import {getLinkedAccount} from './getLinkedAccount';
import {updateAccountLink} from './updateAccountLink';
import {deleteAccountLink} from './deleteAccountLink';

export const stripeAccountLinkRouter = router({
  createAccountLink,
  getLinkedAccount,
  updateAccountLink,
  deleteAccountLink,
});
