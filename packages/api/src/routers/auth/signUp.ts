import {Prisma, UserType} from '@prisma/client';
import {TRPCError} from '@trpc/server';
import {auth} from 'auth';
import {v4 as uuid} from 'uuid';
import {z} from 'zod';

import {publicProcedure} from '../../trpc';

import {generateEmailVerificationToken} from './utils';

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
          type: UserType.ADMIN,
        } satisfies Prisma.UserCreateInput,
      });

      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });

      ctx.authRequest?.setSession(session);

      const token = await generateEmailVerificationToken(user.userId);

      await ctx.inngest.send({
        name: 'email/verify.email.email',
        data: {
          userId: session.user.id,
          code: token,
        },
      });

      return {
        success: true,
      };
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Email already exists',
          });
        }
      }

      if (e?.body?.message.includes('Duplicate entry')) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email already exists',
        });
      }

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'An unknown error occurred',
      });
    }
  });
