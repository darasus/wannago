import {TRPCError} from '@trpc/server';
import {z} from 'zod';
import {router, protectedProcedure, publicProcedure} from '../trpcServer';

const getOrganizationById = publicProcedure
  .input(z.object({organizationId: z.string().uuid()}))
  .query(async ({ctx, input}) => {
    return ctx.prisma.organization.findFirst({
      where: {
        id: input.organizationId,
      },
    });
  });

const getOrganizationByExternalId = publicProcedure
  .input(z.object({externalId: z.string()}))
  .query(async ({ctx, input}) => {
    return ctx.prisma.organization.findFirst({
      where: {
        externalId: input.externalId,
      },
    });
  });

export const organizationRouter = router({
  getOrganizationById,
  getOrganizationByExternalId,
});
