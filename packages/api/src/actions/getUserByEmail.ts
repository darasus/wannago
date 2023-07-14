import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  email: z.string().email(),
});

export function getUserByEmail(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const user = await ctx.db
      .selectFrom('User')
      .where('email', '=', input.email)
      .selectAll()
      .executeTakeFirst();

    return user;
  };
}
