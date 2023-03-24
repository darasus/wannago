import {TRPCError} from '@trpc/server';
import {invariant} from 'utils';
import {z} from 'zod';
import {router, publicProcedure, protectedProcedure} from '../trpcServer';

const create = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      logoSrc: z.string().url(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const user = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth.userId,
      includeOrganization: true,
    });

    invariant(
      user,
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    );

    if (!user.organization) {
      return ctx.prisma.organization.create({
        data: {
          name: input.name,
          logoSrc: input.logoSrc,
          disabled: false,
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    } else {
      return ctx.prisma.organization.update({
        where: {
          id: user?.organization.id,
        },
        data: {
          name: input.name,
          logoSrc: input.logoSrc,
          disabled: false,
        },
      });
    }
  });

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

const getMyOrganization = protectedProcedure.query(async ({ctx}) => {
  const organization = await ctx.actions.getOrganizationByUserExternalId({
    externalId: ctx.auth.userId,
  });

  return organization;
});

const remove = protectedProcedure
  .input(
    z.object({
      organizationId: z.string().uuid(),
    })
  )
  .mutation(async ({ctx, input}) => {
    return ctx.prisma.organization.update({
      where: {
        id: input.organizationId,
      },
      data: {
        name: null,
        logoSrc: null,
        disabled: true,
      },
    });
  });

const getMyOrganizationMembers = protectedProcedure.query(async ({ctx}) => {
  const organization = await ctx.actions.getOrganizationByUserExternalId({
    externalId: ctx.auth.userId,
  });

  if (!organization) {
    return [];
  }

  return ctx.prisma.user.findMany({
    where: {
      organizationId: organization.id,
    },
  });
});

const addOrganizationMember = protectedProcedure
  .input(
    z.object({
      organizationId: z.string().uuid(),
      userEmail: z.string().email(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const user = await ctx.actions.getUserByEmail({
      email: input.userEmail,
    });

    invariant(
      user,
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'User with this email does not exist.',
      })
    );

    return ctx.prisma.organization.update({
      where: {
        id: input.organizationId,
      },
      data: {
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  });

const removeOrganizationMember = protectedProcedure
  .input(
    z.object({
      organizationId: z.string().uuid(),
      userId: z.string().uuid(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const organization =
      await ctx.actions.getOrganizationWithMembersByOrganizationId({
        id: input.organizationId,
      });

    invariant(organization, 'Organization not found');

    if (organization?.users?.length === 1) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cannot remove the last member of the organization.',
      });
    }

    return ctx.prisma.user.update({
      where: {
        id: input.userId,
      },
      data: {
        organization: {
          delete: true,
        },
      },
    });
  });

export const organizationRouter = router({
  create,
  remove,
  getMyOrganization,
  getMyOrganizationMembers,
  getOrganizationById,
  getOrganizationByExternalId,
  addOrganizationMember,
  removeOrganizationMember,
});
