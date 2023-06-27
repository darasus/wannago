import {createTRPCRouter, protectedProcedure, publicProcedure} from '../trpc';
import {organizationNotFoundError, userNotFoundError} from 'error';
import {getBaseUrl, invariant} from 'utils';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';
import {get} from '@vercel/edge-config';
import {env} from 'server-env';

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
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth.userId,
      },
      include: {
        organization: true,
      },
    });

    if (input.plan === 'wannago_pro') {
      invariant(user, userNotFoundError);

      stripeCustomerId = user.stripeCustomerId || undefined;
      email = user.email;
    }

    if (input.plan === 'wannago_business') {
      invariant(user?.organization, organizationNotFoundError);

      stripeCustomerId = user.organization.stripeCustomerId || undefined;
      email = user.organization.email || undefined;
    }

    invariant(
      email,
      new TRPCError({code: 'BAD_REQUEST', message: 'Email is required'})
    );

    const callbackUrl =
      input.plan === 'wannago_pro'
        ? `${getBaseUrl()}/settings`
        : `${getBaseUrl()}/organizations/${user?.organization?.id}/settings/`;

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

    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth.userId,
      },
      include: {
        organization: true,
      },
    });

    if (input.plan === 'wannago_pro') {
      invariant(user, userNotFoundError);

      stripeCustomerId = user.stripeCustomerId || undefined;
    }

    if (input.plan === 'wannago_business') {
      invariant(user?.organization, organizationNotFoundError);

      stripeCustomerId = user.organization.stripeCustomerId || undefined;
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

    const callbackUrl =
      input.plan === 'wannago_pro'
        ? `${getBaseUrl()}/settings`
        : `${getBaseUrl()}/organizations/${user?.organization?.id}/settings/`;

    const portalSession = await ctx.stripe.client.billingPortal.sessions.create(
      {
        customer: customer.id,
        return_url: callbackUrl,
      }
    );

    return portalSession.url;
  });

const getMySubscription = publicProcedure
  .input(
    z.object({
      type: z.enum(['PRO', 'BUSINESS']),
    })
  )
  .query(async ({ctx, input}) => {
    if (input.type === 'PRO') {
      const user = await ctx.prisma.user.findFirst({
        where: {
          externalId: ctx.auth?.userId,
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
              externalId: ctx.auth?.userId,
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

export const subscriptionRouter = createTRPCRouter({
  createCheckoutSession,
  createCustomerPortalSession,
  getMySubscription,
});
