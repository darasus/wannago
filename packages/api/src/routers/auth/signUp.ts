import {z} from 'zod';
import {publicProcedure} from '../../trpc';
import {auth} from 'auth';
import {TRPCError} from '@trpc/server';
import {
  generateEmailVerificationToken,
  sendEmailVerificationLink,
} from './utils';
import {Prisma} from '@prisma/client';
import {v4 as uuid} from 'uuid';

export const signUp = publicProcedure
  .input(
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      password: z.string().min(6).max(255),
    })
  )
  .mutation(async ({ctx, input}) => {
    try {
      const user = await auth.createUser({
        userId: uuid(),
        key: {
          providerId: 'email',
          providerUserId: input.email.toLowerCase(),
          password: input.password,
        },
        attributes: {
          email: input.email.toLowerCase(),
          email_verified: false,
          firstName: input.firstName,
          lastName: input.lastName,
        } satisfies Prisma.UserCreateInput,
      });
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });

      ctx.authRequest?.setSession(session);

      const token = await generateEmailVerificationToken(user.userId);

      await sendEmailVerificationLink(token);

      return {
        success: true,
      };
    } catch (e) {
      console.log(e);
      // if (e instanceof SqliteError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      //   return NextResponse.json(
      //     {
      //       error: 'Account already exists',
      //     },
      //     {
      //       status: 400,
      //     }
      //   );
      // }

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'An unknown error occurred',
      });
    }
  });
