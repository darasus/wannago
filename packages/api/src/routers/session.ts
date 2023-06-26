import {z} from 'zod';
import {router, publicProcedure} from '../trpc';

const sessionType = z.enum(['user', 'organization']);

const setSession = publicProcedure
  .input(z.object({userType: sessionType}))
  .mutation(async ({ctx, input}) => {
    const key = `session-${ctx.auth?.userId}`;
    await ctx.cache.redis.set(key, input.userType, {ex: 100});
  });

const getSession = publicProcedure.query(async ({ctx, input}) => {
  const key = `session-${ctx.auth?.userId}`;
  const result = await ctx.cache.redis.get(key);

  return (result || 'user') as z.infer<typeof sessionType>;
});

export const sessionRouter = router({
  setSession,
  getSession,
});
