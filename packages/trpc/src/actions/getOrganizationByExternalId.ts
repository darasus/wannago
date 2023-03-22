import {TRPCError} from '@trpc/server';
import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  externalId: z.string(),
});

export function getOrganizationByExternalId(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const organization = await ctx.prisma.organization.findFirst({
      where: {
        externalId: input.externalId,
      },
    });

    return organization;
  };
}
