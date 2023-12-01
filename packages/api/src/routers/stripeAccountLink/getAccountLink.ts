import {TRPCError} from '@trpc/server';
import {organizerNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpc';
import {Stripe} from 'lib/src/stripe';

export const getAccountLink = protectedProcedure
  .input(
    z.object({
      organizerId: z.string().uuid(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const stripe = new Stripe().client;

    const organizer = await ctx.actions.getOrganizerById({
      id: input.organizerId,
    });

    invariant(organizer, organizerNotFoundError);
    invariant(
      organizer.stripeLinkedAccountId,
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Your account is not connected to Stripe',
      })
    );

    const account = await stripe.accounts.createLoginLink(
      organizer.stripeLinkedAccountId
    );

    return account?.url || null;
  });
