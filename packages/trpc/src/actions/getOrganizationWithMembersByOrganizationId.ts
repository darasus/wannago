import {TRPCError} from '@trpc/server';
import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  id: z.string().uuid(),
});

export function getOrganizationWithMembersByOrganizationId(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const organization = await ctx.prisma.organization.findFirst({
      where: {
        id: input.id,
        disabled: false,
      },
      include: {
        users: true,
      },
    });

    return organization;
  };
}
