import {initTRPC, TRPCError} from '@trpc/server';
import superjson from 'superjson';
import {ZodError} from 'zod';
import {captureException} from '@sentry/nextjs';
import {createContext} from './context';

export const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({shape, error, ctx, path, input, type}) {
    console.log('>>> error', error);

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

    captureException(error, (scope) => {
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

export const createTRPCRouter = t.router;

export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ctx, next}) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({code: 'UNAUTHORIZED'});
  }

  return next({
    ctx: {auth: ctx.auth},
  });
});

const enforceUserIsAdmin = t.middleware(async ({ctx, next}) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      externalId: ctx.auth?.userId,
    },
  });

  if (user?.type === 'ADMIN') {
    return next({
      ctx: {auth: ctx.auth},
    });
  }

  throw new TRPCError({code: 'UNAUTHORIZED'});
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
export const adminProcedure = t.procedure.use(enforceUserIsAdmin);
