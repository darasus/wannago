import {userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpc';
import {Stripe} from 'lib/src/stripe';
import {getUserByExternalId} from '../../actions/getUserByExternalId';

export const getAccount = protectedProcedure
  .input(
    z.object({
      type: z.enum(['PRO', 'BUSINESS']),
    })
  )
  .query(async ({ctx, input}) => {
    const stripe = new Stripe().client;
    const user = await getUserByExternalId(ctx)({
      externalId: ctx.auth.userId,
      includeOrganization: true,
    });

    invariant(user, userNotFoundError);

    if (input.type === 'PRO' && !user.stripeLinkedAccountId) {
      return null;
    }

    if (
      input.type === 'BUSINESS' &&
      !user.organization?.stripeLinkedAccountId
    ) {
      return null;
    }

    let stripeLinkedAccountId = '';

    if (input.type === 'PRO' && user.stripeLinkedAccountId) {
      stripeLinkedAccountId = user.stripeLinkedAccountId;
    }

    if (input.type === 'BUSINESS' && user.organization?.stripeLinkedAccountId) {
      stripeLinkedAccountId = user.organization?.stripeLinkedAccountId;
    }

    const account = await stripe.accounts.retrieve(
      {
        expand: ['external_accounts'],
      },
      {
        stripeAccount: stripeLinkedAccountId,
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
