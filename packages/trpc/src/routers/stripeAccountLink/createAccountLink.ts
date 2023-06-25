import {organizationNotFoundError, userNotFoundError} from 'error';
import {getBaseUrl, invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpcServer';

export const createAccountLink = protectedProcedure
  .input(z.object({type: z.enum(['PRO', 'BUSINESS'])}))
  .mutation(async ({ctx, input}) => {
    const user = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth.userId,
      includeOrganization: true,
    });
    invariant(user, userNotFoundError);

    let stripeLinkedAccountId = '';

    if (input.type === 'PRO' && user.stripeLinkedAccountId) {
      stripeLinkedAccountId = user.stripeLinkedAccountId;
    }

    if (input.type === 'BUSINESS' && user.organization?.stripeLinkedAccountId) {
      stripeLinkedAccountId = user.organization?.stripeLinkedAccountId;
    }

    if (!stripeLinkedAccountId) {
      const account = await ctx.stripe.client.accounts.create({
        type: 'express',
        business_type: input.type === 'BUSINESS' ? 'company' : 'individual',
        ...(input.type === 'BUSINESS' ? {} : {}),
        default_currency: ctx.currency.toLowerCase(),
        settings: {
          payouts: {
            schedule: {
              interval: 'manual',
            },
          },
        },
      });

      stripeLinkedAccountId = account.id;
    }

    if (input.type === 'PRO') {
      await ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeLinkedAccountId,
        },
      });
    }

    if (input.type === 'BUSINESS') {
      invariant(user.organization, organizationNotFoundError);

      await ctx.prisma.organization.update({
        where: {
          id: user.organization.id,
        },
        data: {
          stripeLinkedAccountId,
        },
      });
    }

    const callbackUrl =
      input.type === 'PRO'
        ? `${getBaseUrl()}/settings`
        : `${getBaseUrl()}/organizations/${user?.organization?.id}/settings/`;

    const accountLink = await ctx.stripe.client.accountLinks.create({
      account: stripeLinkedAccountId,
      refresh_url: callbackUrl,
      return_url: callbackUrl,
      type: 'account_onboarding',
    });

    return accountLink.url;
  });
