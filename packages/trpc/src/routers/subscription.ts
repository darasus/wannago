import {router, protectedProcedure} from '../trpcServer';
import {userNotFoundError} from 'error';
import {getBaseUrl, invariant} from 'utils';
import {z} from 'zod';

type ProductPlan = 'wannago_pro' | 'wannago_business';

const callbackUrlMap: Record<ProductPlan, string> = {
  wannago_pro: `${getBaseUrl()}/settings/personal`,
  wannago_business: `${getBaseUrl()}/settings/team`,
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

    const callbackUrl = callbackUrlMap[input.plan];

    const session = await ctx.stripe.stripe.checkout.sessions.create({
      customer: user.stripeCustomerId || undefined,
      customer_email: user.stripeCustomerId ? undefined : user.email,
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: callbackUrl,
      cancel_url: callbackUrl,
    });

    return session.url;
  });

const createCustomerPortalSession = protectedProcedure.mutation(
  async ({ctx}) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth.userId,
      },
      include: {
        subscription: true,
      },
    });

    invariant(user, userNotFoundError);

    if (!user.stripeCustomerId) return null;

    const customer = await ctx.stripe.stripe.customers.retrieve(
      user.stripeCustomerId
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
