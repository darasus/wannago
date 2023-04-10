import {z} from 'zod';
import {ActionContext} from '../context';

const sessionType = z.enum(['user', 'organization']);

export function getActiveSessionType(ctx: ActionContext) {
  return async () => {
    const key = `session-${ctx.auth?.userId}`;
    const result = await ctx.cache.redis.get(key);

    return sessionType.parse(result || 'user');
  };
}
