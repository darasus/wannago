import {publicProcedure} from '../../trpc';
import {getPageSession} from 'auth';
import {generateEmailVerificationToken} from './utils';
import {TRPCError} from '@trpc/server';

export const sendEmailVerificationEmail = publicProcedure.mutation(
  async ({ctx}) => {
    const session = await getPageSession();

    if (!session) {
      return new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });
    }

    if (session.user?.email_verified) {
      return {success: false};
    }

    try {
      const token = await generateEmailVerificationToken(session.user.id);
      await ctx.postmark.sendToTransactionalStream({
        to: session.user.email,
        subject: 'Verify your email',
        htmlString: `<p>${token}</p>`,
      });
      return {success: true};
    } catch {
      return new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unknown error occurred',
      });
    }
  }
);
