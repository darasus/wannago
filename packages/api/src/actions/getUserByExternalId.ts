import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  externalId: z.string(),
});

export function getUserByExternalId(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    return ctx.db
      .selectFrom('User')
      .where('externalId', '=', input.externalId)
      .selectAll()
      .executeTakeFirst();
  };
}
