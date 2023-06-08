import {router, protectedProcedure} from '../trpcServer';
import {organizationNotFoundError, userNotFoundError} from 'error';
import {getBaseUrl, invariant} from 'utils';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';
import {get} from '@vercel/edge-config';
import {env} from 'server-env';

type ProductPlan = 'wannago_pro' | 'wannago_business';

const callbackUrlMap: Record<ProductPlan, string> = {
  wannago_pro: `${getBaseUrl()}/settings/personal`,
  wannago_business: `${getBaseUrl()}/settings/team`,
};

const priceSchema = z.object({
  price_ids: z.object({
    wannago_pro: z.string(),
    wannago_business: z.string(),
  }),
});

const getConfig = async () => {
  const response = await get(env.VERCEL_ENV);
  return priceSchema.parse(response);
};

const createCheckoutSession = protectedProcedure
  .input(z.object({plan: z.enum(['wannago_pro', 'wannago_business'])}))
  .mutation(async ({ctx, input}) => {
    let stripeCustomerId: string | undefined;
    let email: string | undefined;

    if (input.plan === 'wannago_pro') {
      const user = await ctx.actions.getUserByExternalId({
        externalId: ctx.auth.userId,
      });

      invariant(user, userNotFoundError);

      stripeCustomerId = user.stripeCustomerId || undefined;
      email = user.email;
    }

    if (input.plan === 'wannago_business') {
      const organization = await ctx.actions.getOrganizationByUserExternalId({
        externalId: ctx.auth.userId,
      });

      invariant(organization, organizationNotFoundError);

      stripeCustomerId = organization.stripeCustomerId || undefined;
      email = organization.email || undefined;
    }

    invariant(
      email,
      new TRPCError({code: 'BAD_REQUEST', message: 'Email is required'})
    );

    const callbackUrl = callbackUrlMap[input.plan];
    const config = await getConfig();

    const session = await ctx.stripe.client.checkout.sessions.create({
      customer: stripeCustomerId,
      customer_email: stripeCustomerId ? undefined : email,
      customer_update: stripeCustomerId
        ? {
            name: 'auto',
            address: 'auto',
          }
        : undefined,
      billing_address_collection: 'auto',
      line_items: [
        {
          price: config.price_ids[input.plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: callbackUrl,
      cancel_url: callbackUrl,
      tax_id_collection: {
        enabled: true,
      },
      allow_promotion_codes: true,
    });

    return session.url;
  });

const createCustomerPortalSession = protectedProcedure
  .input(z.object({plan: z.enum(['wannago_pro', 'wannago_business'])}))
  .mutation(async ({ctx, input}) => {
    let stripeCustomerId: string | undefined;

    if (input.plan === 'wannago_pro') {
      const user = await ctx.prisma.user.findFirst({
        where: {
          externalId: ctx.auth.userId,
        },
      });

      invariant(user, userNotFoundError);

      stripeCustomerId = user.stripeCustomerId || undefined;
    }

    if (input.plan === 'wannago_business') {
      const organization = await ctx.actions.getOrganizationByUserExternalId({
        externalId: ctx.auth.userId,
      });

      invariant(organization, organizationNotFoundError);

      stripeCustomerId = organization.stripeCustomerId || undefined;
    }

    invariant(
      stripeCustomerId,
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Stripe customer ID is required',
      })
    );

    const customer = await ctx.stripe.client.customers.retrieve(
      stripeCustomerId
    );

    const callbackUrl = callbackUrlMap[input.plan];

    const portalSession = await ctx.stripe.client.billingPortal.sessions.create(
      {
        customer: customer.id,
        return_url: callbackUrl,
      }
    );

    return portalSession.url;
  });

const getMySubscription = protectedProcedure
  .input(
    z.object({
      type: z.enum(['PRO', 'BUSINESS']),
    })
  )
  .query(async ({ctx, input}) => {
    if (input.type === 'PRO') {
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
    }

    if (input.type === 'BUSINESS') {
      const organization = await ctx.prisma.organization.findFirst({
        where: {
          users: {
            some: {
              externalId: ctx.auth.userId,
            },
          },
        },
        include: {
          subscription: true,
        },
      });

      if (!organization) return null;

      return organization.subscription;
    }

    return null;
  });

export const subscriptionRouter = router({
  createCheckoutSession,
  createCustomerPortalSession,
  getMySubscription,
});
