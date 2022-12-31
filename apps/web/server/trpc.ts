import {Context} from './context';
import {initTRPC, TRPCError} from '@trpc/server';
import superjson from 'superjson';
import {ZodError} from 'zod';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({shape, error}) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const middleware = t.middleware;

const isAuthenticated = middleware(({next, ctx}) => {
  if (!ctx.user) {
    throw new TRPCError({code: 'UNAUTHORIZED', message: 'Not authenticated'});
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

const logger = middleware(async ({next, path, type, meta}) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  result.ok
    ? console.log('OK request timing:', {path, type, durationMs, meta})
    : console.log('Non-OK request timing', {path, type, durationMs, meta});
  return result;
});

export const router = t.router;

export const publicProcedure = t.procedure.use(logger);

export const mergeRouters = t.mergeRouters;

export const protectedProcedure = t.procedure.use(isAuthenticated);
