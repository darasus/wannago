import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  id: z.string(),
});

export function getUserById(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    if (!ctx.auth?.user.id) {
      return null;
    }

    const users = await ctx.db
      .selectFrom('User')
      .where('User.id', '=', ctx.auth.user.id)
      .selectAll()
      .execute();

    return users[0];
  };
}
