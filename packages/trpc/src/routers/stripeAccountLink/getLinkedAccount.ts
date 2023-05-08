import {userNotFoundError} from 'error';
import {invariant} from 'utils';
import {protectedProcedure} from '../../trpcServer';

export const getLinkedAccount = protectedProcedure.query(async ({ctx}) => {
  const user = await ctx.actions.getUserByExternalId({
    externalId: ctx.auth.userId,
  });

  invariant(user, userNotFoundError);

  if (!user.stripeLinkedAccountId) {
    return null;
  }

  const account = await ctx.stripe.stripe.accounts.retrieve(
    {
      expand: ['external_accounts'],
    },
    {
      stripeAccount: user.stripeLinkedAccountId,
    }
  );

  console.log(JSON.stringify(account, null, 2));

  if (!account) {
    return null;
  }

  return {
    id: account.id,
  };
});
