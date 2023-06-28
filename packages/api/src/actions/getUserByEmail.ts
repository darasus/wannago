import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  email: z.string().email(),
});

export function getUserByEmail(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    return user;
  };
}
