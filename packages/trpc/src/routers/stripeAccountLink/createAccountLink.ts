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

    const account = await ctx.stripe.stripe.accounts.create({
      type: 'express',
      business_type: 'individual',
    });

    if (input.type === 'PRO') {
      invariant(user, userNotFoundError);

      await ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeLinkedAccountId: account.id,
        },
      });
    }

    if (input.type === 'BUSINESS') {
      invariant(user, userNotFoundError);
      invariant(user.organization, organizationNotFoundError);

      await ctx.prisma.organization.update({
        where: {
          id: user.organization.id,
        },
        data: {
          stripeLinkedAccountId: account.id,
        },
      });
    }

    const accountLink = await ctx.stripe.stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${getBaseUrl()}/settings/${
        input.type === 'PRO' ? 'personal' : 'team'
      }`,
      return_url: `${getBaseUrl()}/settings/${
        input.type === 'PRO' ? 'personal' : 'team'
      }`,
      type: 'account_onboarding',
    });

    return accountLink.url;
  });
