import {z} from 'zod';
import {publicProcedure} from '../../trpc';
import {auth} from 'auth';
import {TRPCError} from '@trpc/server';
import {LuciaError} from 'lucia';

export const signIn = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6).max(255),
    })
  )
  .mutation(async ({ctx, input}) => {
    try {
      // find user by key
      // and validate password
      const key = await auth.useKey(
        'email',
        input.email.toLowerCase(),
        input.password
      );
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      });

      ctx.authRequest?.setSession(session);

      return {success: 'true'};
    } catch (e) {
      if (
        e instanceof LuciaError &&
        (e.message === 'AUTH_INVALID_KEY_ID' ||
          e.message === 'AUTH_INVALID_PASSWORD')
      ) {
        // user does not exist
        // or invalid password
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Incorrect email or password',
        });
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      });
    }
  });
