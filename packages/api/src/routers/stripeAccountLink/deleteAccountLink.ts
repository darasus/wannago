import {TRPCError} from '@trpc/server';
import {organizerNotFoundError} from 'error';
import {invariant, isOrganization, isUser} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpc';

export const deleteAccountLink = protectedProcedure
  .input(
    z.object({
      organizerId: z.string().uuid(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const organizer = await ctx.actions.getOrganizerById({
      id: ctx.auth?.user?.id,
    });

    invariant(organizer, organizerNotFoundError);
    invariant(
      organizer.stripeLinkedAccountId,
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User does not have a linked account',
      })
    );

    await ctx.stripe.accounts.del(organizer.stripeLinkedAccountId);

    if (isUser(organizer)) {
      await ctx.prisma.user.update({
        where: {
          id: organizer.id,
        },
        data: {
          stripeLinkedAccountId: null,
        },
      });

      return {success: true};
    }

    if (isOrganization(organizer)) {
      await ctx.prisma.organization.update({
        where: {
          id: organizer.id,
        },
        data: {
          stripeLinkedAccountId: null,
        },
      });

      return {success: true};
    }

    return {success: false};
  });
