import {router, protectedProcedure} from '../trpcServer';
import {z} from 'zod';
import {userNotFoundError} from 'error';
import {invariant} from 'utils';

const createProSubscriptionLink = protectedProcedure.query(
  async ({ctx, input}) => {
    const user = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth.userId,
    });

    invariant(user, userNotFoundError);

    const link = await ctx.stripe.stripe.paymentLinks.retrieve(
      'plink_1MqCoaFblQX9XpW1P2AFD8rP'
    );

    const url = new URL(link.url);
    url.searchParams.append('prefilled_email', user.email);

    return {url: url.toString()};
  }
);

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

  const customerPortalUrl = new URL(
    'https://billing.stripe.com/p/login/test_6oEcP2d7u0XCdgYbII'
  );

  customerPortalUrl.searchParams.append('prefilled_email', user.email);

  return {
    subscription: user?.subscription,
    customerPortalUrl: customerPortalUrl.toString(),
  };
});

export const subscriptionRouter = router({
  createProSubscriptionLink,
  getMySubscription,
});
