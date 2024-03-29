import {publicProcedure} from '../../trpc';
import {generatePasswordResetToken} from './utils';
import {getBaseUrl} from 'utils';
import {TRPCError} from '@trpc/server';
import {z} from 'zod';
import {Emails} from 'lib/src/Resend';

export const sendPasswordResetEmail = publicProcedure
  .input(z.object({email: z.string().email()}))
  .mutation(async ({ctx, input}) => {
    try {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User with this email does not exist',
        });
      }

      const token = await generatePasswordResetToken(user.id);

      await ctx.resend.emails.send({
        to: user.email,
        from: Emails.Hi,
        subject: 'Password reset',
        html: `<p><a href="${getBaseUrl()}/password-reset/${token}">link</a></p>`,
      });

      return {success: true};
    } catch (e) {
      if (e instanceof TRPCError) throw e;

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unknown error occurred',
      });
    }
  });
