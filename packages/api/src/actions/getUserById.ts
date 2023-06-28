import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  id: z.string(),
});

export function getUserById(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input.id,
      },
    });

    return user;
  };
}
