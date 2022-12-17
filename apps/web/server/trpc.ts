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

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;

const isAuthed = t.middleware(({next, ctx}) => {
  if (!ctx.user) {
    throw new TRPCError({code: 'UNAUTHORIZED'});
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
