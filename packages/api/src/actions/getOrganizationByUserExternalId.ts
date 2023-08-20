import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  id: z.string().uuid(),
});

export function getOrganizationByUserExternalId(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const organization = await ctx.prisma.organization.findFirst({
      where: {
        disabled: false,
        users: {
          some: {
            id: input.id,
          },
        },
      },
    });

    return organization;
  };
}
