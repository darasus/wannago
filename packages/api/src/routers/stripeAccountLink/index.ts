import {createTRPCRouter} from '../../trpc';
import {createAccountLink} from './createAccountLink';
import {getAccount} from './getAccount';
import {getAccountLink} from './getAccountLink';
import {deleteAccountLink} from './deleteAccountLink';

export const stripeAccountLinkRouter = createTRPCRouter({
  createAccountLink,
  getAccount,
  getAccountLink,
  deleteAccountLink,
});
