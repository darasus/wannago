import {Context} from './context';
import {initTRPC, TRPCError} from '@trpc/server';
import superjson from 'superjson';
import {ZodError} from 'zod';
import {UserType} from '@prisma/client';
import {captureException} from '@sentry/nextjs';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({shape, error, ctx, path, input, type}) {
    const e = {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };

    captureException(error, scope => {
      scope.setUser({
        id: ctx?.auth?.userId || undefined,
      });
      if (path) {
        scope.setContext('path', {path});
      }
      if (input) {
        scope.setContext('input', {input});
      }
      if (type) {
        scope.setContext('type', {type});
      }

      return scope;
    });

    return e;
  },
});

export const middleware = t.middleware;

const isAuthenticated = middleware(({next, ctx}) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({code: 'UNAUTHORIZED', message: 'Not authenticated'});
  }

  return next({
    ctx: {auth: ctx.auth},
  });
});

const isAdmin = middleware(async ({next, ctx}) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      externalId: ctx.auth?.userId,
    },
  });

  if (user?.type === UserType.ADMIN) {
    return next({
      ctx: {auth: ctx.auth},
    });
  }

  throw new TRPCError({code: 'UNAUTHORIZED', message: 'Not authenticated'});
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const mergeRouters = t.mergeRouters;

export const protectedProcedure = t.procedure.use(isAuthenticated);

export const adminProcedure = t.procedure.use(isAdmin);
