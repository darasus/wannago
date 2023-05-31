import {userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpcServer';

export const getAccount = protectedProcedure
  .input(
    z.object({
      type: z.enum(['PRO', 'BUSINESS']),
    })
  )
  .query(async ({ctx, input}) => {
    const user = await ctx.actions.getUserByExternalId({
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

    const account = await ctx.stripe.stripe.accounts.retrieve(
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
