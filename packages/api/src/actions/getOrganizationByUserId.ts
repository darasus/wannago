import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  userId: z.string().uuid(),
});

export function getOrganizationByUserId(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const organization = await ctx.prisma.organization.findFirst({
      where: {
        disabled: false,
        users: {
          some: {
            id: input.userId,
          },
        },
      },
    });

    return organization;
  };
}
