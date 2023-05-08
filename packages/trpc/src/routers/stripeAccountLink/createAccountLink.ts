import {userNotFoundError} from 'error';
import {getBaseUrl, invariant} from 'utils';
import {protectedProcedure} from '../../trpcServer';

export const createAccountLink = protectedProcedure.mutation(async ({ctx}) => {
  const user = await ctx.actions.getUserByExternalId({
    externalId: ctx.auth.userId,
  });

  invariant(user, userNotFoundError);

  const account = await ctx.stripe.stripe.accounts.create({
    type: 'express',
  });

  await ctx.prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      stripeLinkedAccountId: account.id,
    },
  });

  const accountLink = await ctx.stripe.stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${getBaseUrl()}/settings/personal`,
    return_url: `${getBaseUrl()}/settings/personal`,
    type: 'account_onboarding',
  });

  return accountLink.url;
});
