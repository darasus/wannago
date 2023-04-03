import {router, protectedProcedure} from '../trpcServer';
import {userNotFoundError} from 'error';
import {getBaseUrl, invariant} from 'utils';

const getProSubscriptionLink = protectedProcedure.query(
  async ({ctx, input}) => {
    const user = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth.userId,
    });

    invariant(user, userNotFoundError);

    const url = new URL(`${getBaseUrl()}/api/create-checkout-session`);

    url.searchParams.append('plan', 'wannago_pro');
    url.searchParams.append('customerEmail', user.email);

    return url.toString();
  }
);

const getCustomerPortalLink = protectedProcedure.query(async ({ctx, input}) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      externalId: ctx.auth.userId,
    },
    include: {
      subscription: true,
    },
  });

  invariant(user, userNotFoundError);

  const url = new URL(`${getBaseUrl()}/api/create-portal-session`);

  if (!user.subscription?.customer) {
    return null;
  }

  url.searchParams.append('customerId', user.subscription?.customer);

  return url.toString();
});

const getMySubscription = protectedProcedure.query(async ({ctx, input}) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      externalId: ctx.auth.userId,
    },
    include: {
      subscription: true,
    },
  });

  invariant(user, userNotFoundError);

  return user.subscription;
});

export const subscriptionRouter = router({
  getProSubscriptionLink,
  getCustomerPortalLink,
  getMySubscription,
});
