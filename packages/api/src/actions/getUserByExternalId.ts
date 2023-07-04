import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  externalId: z.string(),
  includeOrganizations: z.boolean().nullable().optional(),
});

export function getUserByExternalId(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: input.externalId,
      },
      include: {
        organizations: input.includeOrganizations ?? false,
      },
    });

    return user;
  };
}
