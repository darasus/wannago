import {router, protectedProcedure} from '../trpcServer';
import {userNotFoundError} from 'error';
import {getBaseUrl, invariant} from 'utils';
import {z} from 'zod';

type ProductPlan = 'wannago_pro' | 'wannago_business';

const callbackPathMap: Record<ProductPlan, string> = {
  wannago_pro: '/settings/personal',
  wannago_business: '/settings/team',
};

const createCheckoutSession = protectedProcedure
  .input(z.object({plan: z.enum(['wannago_pro'])}))
  .mutation(async ({ctx, input}) => {
    const user = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth.userId,
    });

    invariant(user, userNotFoundError);

    const prices = await ctx.stripe.stripe.prices.list({
      lookup_keys: [input.plan],
      expand: ['data.product'],
    });

    const callbackPath = callbackPathMap[input.plan];

    const session = await ctx.stripe.stripe.checkout.sessions.create({
      customer_email: user.email,
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      // TODO: fix
      success_url: `${getBaseUrl()}${callbackPath}`,
      cancel_url: `${getBaseUrl()}${callbackPath}`,
    });

    return session.url;
  });

const createCustomerPortalSession = protectedProcedure.mutation(
  async ({ctx, input}) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth.userId,
      },
      include: {
        subscription: true,
      },
    });

    invariant(user, userNotFoundError);

    if (!user.subscription?.customer) return null;

    const customer = await ctx.stripe.stripe.customers.retrieve(
      user.subscription?.customer
    );

    const portalSession = await ctx.stripe.stripe.billingPortal.sessions.create(
      {
        customer: customer.id,
        // TODO: fix
        return_url: `${getBaseUrl()}/settings/personal`,
      }
    );

    return portalSession.url;
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

  return user.subscription;
});

export const subscriptionRouter = router({
  createCheckoutSession,
  createCustomerPortalSession,
  getMySubscription,
});
