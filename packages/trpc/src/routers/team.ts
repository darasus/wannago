import {TRPCError} from '@trpc/server';
import {z} from 'zod';
import {protectedProcedure, router} from '../trpcServer';

const inviteTeamMember = protectedProcedure
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const user = ctx.prisma.user.findFirst({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    await ctx.clerk.organizations.createOrganizationInvitation({
      emailAddress: input.email,
      inviterUserId: ctx.auth.userId,
      organizationId: '',
      role: 'admin',
    });

    return {success: true};
  });

export const teamRouter = router({
  inviteTeamMember,
});
