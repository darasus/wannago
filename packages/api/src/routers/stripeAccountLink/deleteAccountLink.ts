import {TRPCError} from '@trpc/server';
import {organizationNotFoundError, userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpc';
import {Stripe} from 'lib/src/stripe';
import {getUserByExternalId} from '../../actions/getUserByExternalId';

export const deleteAccountLink = protectedProcedure
  .input(
    z.object({
      type: z.enum(['PRO', 'BUSINESS']),
    })
  )
  .mutation(async ({ctx, input}) => {
    const stripe = new Stripe().client;

    const user = await getUserByExternalId(ctx)({
      externalId: ctx.auth.userId,
      includeOrganization: true,
    });

    if (input.type === 'PRO') {
      invariant(user, userNotFoundError);
      invariant(
        user.stripeLinkedAccountId,
        new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User does not have a linked account',
        })
      );

      await stripe.accounts.del(user.stripeLinkedAccountId);

      await ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeLinkedAccountId: null,
        },
      });

      return {success: true};
    }

    if (input.type === 'BUSINESS') {
      invariant(user, userNotFoundError);
      invariant(user.organization, organizationNotFoundError);
      invariant(
        user.organization.stripeLinkedAccountId,
        new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Organization does not have a linked account',
        })
      );

      await stripe.accounts.del(user.organization.id);

      await ctx.prisma.organization.update({
        where: {
          id: user.organization.id,
        },
        data: {
          stripeLinkedAccountId: null,
        },
      });

      return {success: true};
    }

    return {success: false};
  });
