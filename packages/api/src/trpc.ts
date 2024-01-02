import {initTRPC, TRPCError} from '@trpc/server';
import superjson from 'superjson';
import {createContext} from './context';

export const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;

export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ctx, next}) => {
  if (!ctx.auth?.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: `You're not logged in. To continue please login first.`,
    });
  }

  return next({
    ctx: {auth: ctx.auth},
  });
});

const enforceUserIsAdmin = t.middleware(async ({ctx, next}) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      id: ctx.auth?.user?.id,
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
