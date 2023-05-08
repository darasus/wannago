import {TRPCError} from '@trpc/server';
import {userNotFoundError} from 'error';
import {invariant} from 'utils';
import {protectedProcedure} from '../../trpcServer';

export const deleteAccountLink = protectedProcedure.mutation(async ({ctx}) => {
  const user = await ctx.actions.getUserByExternalId({
    externalId: ctx.auth.userId,
  });

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

  return {success: account.deleted};
});
