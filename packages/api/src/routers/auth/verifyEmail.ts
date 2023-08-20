import {z} from 'zod';
import {publicProcedure} from '../../trpc';
import {TRPCError} from '@trpc/server';
import {isWithinExpiration} from 'lucia/utils';

export const verifyEmail = publicProcedure
  .input(
    z.object({
      code: z.string().length(6),
    })
  )
  .mutation(async ({ctx, input}) => {
    try {
      const existingCode = await ctx.prisma.emailVerificationToken.findFirst({
        where: {
          id: input.code,
        },
      });

      if (!existingCode) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid code',
        });
      }

      if (!isWithinExpiration(existingCode.expires.getTime())) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Code is expired, please resend code again.',
        });
      }

      await ctx.prisma.user.update({
        where: {
          id: existingCode.user_id,
        },
        data: {
          email_verified: true,
        },
      });

      return {success: true};
    } catch (e) {
      return {success: false};
    }
  });
