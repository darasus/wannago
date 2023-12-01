import {organizerNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpc';
import {Stripe} from 'lib/src/stripe';

export const getAccount = protectedProcedure
  .input(
    z.object({
      organizerId: z.string().uuid(),
    })
  )
  .query(async ({ctx, input}) => {
    const stripe = new Stripe().client;

    const organizer = await ctx.actions.getOrganizerById({
      id: input.organizerId,
    });

    invariant(organizer, organizerNotFoundError);

    if (!organizer.stripeLinkedAccountId) {
      return null;
    }

    const account = await stripe.accounts.retrieve(
      {
        expand: ['external_accounts'],
      },
      {
        stripeAccount: organizer.stripeLinkedAccountId,
      }
    );

    if (!account.details_submitted) {
      return null;
    }

    if (!account) {
      return null;
    }

    return {
      id: account.id,
    };
  });
