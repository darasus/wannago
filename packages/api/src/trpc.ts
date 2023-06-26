/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

import type {NextRequest} from 'next/server';
import type {SignedInAuthObject, SignedOutAuthObject} from '@clerk/nextjs/api';
import {initTRPC, TRPCError} from '@trpc/server';
import superjson from 'superjson';
import {ZodError} from 'zod';
import {captureException} from '@sentry/nextjs';
import {createContext} from './context';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
type CreateContextOptions = {
  auth: SignedInAuthObject | SignedOutAuthObject | null;
  req?: NextRequest;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
export const t = initTRPC.context<typeof createContext>().create({
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

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;
export const mergeRouters = t.mergeRouters;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ctx, next}) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({code: 'UNAUTHORIZED'});
  }
  return next({
    ctx: {
      auth: {
        ...ctx.auth,
        userId: ctx.auth.userId,
      },
    },
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
      ctx: {
        auth: ctx.auth,
      },
    });
  }

  throw new TRPCError({code: 'UNAUTHORIZED'});
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
export const adminProcedure = t.procedure.use(enforceUserIsAdmin);
