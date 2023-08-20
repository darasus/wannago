import {z} from 'zod';
import {publicProcedure} from '../../trpc';
import {validatePasswordResetToken} from './utils';
import {TRPCError} from '@trpc/server';
import {auth} from 'auth';
import {userNotFoundError} from 'error';

export const resetPassword = publicProcedure
  .input(
    z.object({
      token: z.string(),
      newPassword: z.string().min(6).max(255),
      repeatNewPassword: z.string().min(6).max(255),
    })
  )
  .mutation(async ({ctx, input}) => {
    try {
      const userId = await validatePasswordResetToken(input.token);

      if (input.newPassword !== input.repeatNewPassword) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Passwords do not match',
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw userNotFoundError;
      }

      await auth.invalidateAllUserSessions(user.id);
      await auth.updateKeyPassword('email', user.email, input.newPassword);

      if (!user.email_verified) {
        await ctx.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            email_verified: true,
          },
        });
      }

      const session = await auth.createSession({
        userId: user.id,
        attributes: {},
      });

      ctx.authRequest?.setSession(session);

      return {success: true};
    } catch (error) {
      console.log(error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid or expired password reset link',
      });
    }
  });
