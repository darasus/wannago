import {TRPCError} from '@trpc/server';
import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  externalId: z.string(),
});

export function getUserByExternalId(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: input.externalId,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return user;
  };
}
