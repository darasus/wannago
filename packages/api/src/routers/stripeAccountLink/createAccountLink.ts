import {organizerNotFoundError} from 'error';
import {getBaseUrl, invariant, isOrganization, isUser} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpc';

export const createAccountLink = protectedProcedure
  .input(z.object({organizerId: z.string().uuid()}))
  .mutation(async ({ctx, input}) => {
    const organizer = await ctx.actions.getOrganizerById({
      id: input.organizerId,
    });
    invariant(organizer, organizerNotFoundError);

    let stripeLinkedAccountId = '';

    if (organizer.stripeLinkedAccountId) {
      stripeLinkedAccountId = organizer.stripeLinkedAccountId;
    }

    if (!stripeLinkedAccountId) {
      const account = await ctx.stripe.accounts.create({
        type: 'standard',
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

    const accountLink = await ctx.stripe.accountLinks.create({
      account: stripeLinkedAccountId,
      refresh_url: callbackUrl,
      return_url: callbackUrl,
      type: 'account_onboarding',
    });

    return accountLink.url;
  });
