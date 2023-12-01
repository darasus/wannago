import {organizerNotFoundError} from 'error';
import {getBaseUrl, invariant, isOrganization, isUser} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpc';
import {Stripe} from 'lib/src/stripe';

export const createAccountLink = protectedProcedure
  .input(z.object({organizerId: z.string().uuid()}))
  .mutation(async ({ctx, input}) => {
    const stripe = new Stripe().client;
    const organizer = await ctx.actions.getOrganizerById({
      id: input.organizerId,
    });
    invariant(organizer, organizerNotFoundError);

    let stripeLinkedAccountId = '';

    if (organizer.stripeLinkedAccountId) {
      stripeLinkedAccountId = organizer.stripeLinkedAccountId;
    }

    if (!stripeLinkedAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
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

    if (isUser(organizer)) {
      await ctx.prisma.user.update({
        where: {
          id: organizer.id,
        },
        data: {
          stripeLinkedAccountId,
        },
      });
    }

    if (isOrganization(organizer)) {
      await ctx.prisma.organization.update({
        where: {
          id: organizer.id,
        },
        data: {
          stripeLinkedAccountId,
        },
      });
    }

    const callbackUrl = isUser(organizer)
      ? `${getBaseUrl()}/settings`
      : `${getBaseUrl()}/organizations/${organizer.id}/settings`;

    const accountLink = await stripe.accountLinks.create({
      account: stripeLinkedAccountId,
      refresh_url: callbackUrl,
      return_url: callbackUrl,
      type: 'account_onboarding',
    });

    return accountLink.url;
  });
