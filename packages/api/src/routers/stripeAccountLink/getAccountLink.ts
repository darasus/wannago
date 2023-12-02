import {TRPCError} from '@trpc/server';
import {organizerNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpc';

export const getAccountLink = protectedProcedure
  .input(
    z.object({
      organizerId: z.string().uuid(),
    })
  )
  .mutation(async ({ctx, input}) => {
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

    const account = await ctx.stripe.accounts.createLoginLink(
      organizer.stripeLinkedAccountId
    );

    return account?.url || null;
  });
