import {TRPCError} from '@trpc/server';
import {organizationNotFoundError, userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpcServer';

export const deleteAccountLink = protectedProcedure
  .input(
    z.object({
      type: z.enum(['PRO', 'BUSINESS']),
    })
  )
  .mutation(async ({ctx, input}) => {
    const user = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth.userId,
      includeOrganization: true,
    });

    if (input.type === 'PRO') {
      invariant(user, userNotFoundError);

      if (!user.stripeLinkedAccountId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User does not have a linked account',
        });
      }

      const account = await ctx.stripe.stripe.accounts.del(
        user.stripeLinkedAccountId
      );

      if (account.deleted) {
        await ctx.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            stripeLinkedAccountId: null,
          },
        });
      }

      return {success: true};
    }

    if (input.type === 'BUSINESS') {
      invariant(user, userNotFoundError);
      invariant(user.organization, organizationNotFoundError);

      if (!user.organization.stripeLinkedAccountId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Organization does not have a linked account',
        });
      }

      const account = await ctx.stripe.stripe.accounts.del(
        user.organization.id
      );

      if (account.deleted) {
        await ctx.prisma.organization.update({
          where: {
            id: user.organization.id,
          },
          data: {
            stripeLinkedAccountId: null,
          },
        });
      }

      return {success: true};
    }

    return {success: false};
  });
