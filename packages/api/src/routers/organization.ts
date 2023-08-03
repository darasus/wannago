import {TRPCError} from '@trpc/server';
import {userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {createTRPCRouter, publicProcedure, protectedProcedure} from '../trpc';
import {getUserByEmail} from '../actions/getUserByEmail';
import {getOrganizationWithMembersByOrganizationId} from '../actions/getOrganizationWithMembersByOrganizationId';

const create = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      logoSrc: z.string().url(),
      email: z.string().email(),
      currency: z.enum(['USD', 'EUR', 'GBP']),
    })
  )
  .mutation(async ({ctx, input}) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth.userId,
      },
    });

    invariant(user, userNotFoundError);

    return ctx.prisma.organization
      .create({
        data: {
          name: input.name,
          logoSrc: input.logoSrc,
          disabled: false,
          email: input.email,
          preferredCurrency: input.currency || 'USD',
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      })
      .catch((error) => {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Seems like indicated email is already in use',
        });
      });
  });

const update = protectedProcedure
  .input(
    z.object({
      organizationId: z.string().uuid(),
      name: z.string(),
      logoSrc: z.string().url(),
      email: z.string().email(),
      currency: z.enum(['USD', 'EUR', 'GBP']),
    })
  )
  .mutation(async ({ctx, input}) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth.userId,
      },
    });

    invariant(user, userNotFoundError);

    return ctx.prisma.organization.update({
      where: {
        id: input.organizationId,
      },
      data: {
        name: input.name,
        logoSrc: input.logoSrc,
        disabled: false,
        email: input.email,
        preferredCurrency: input.currency || 'USD',
      },
    });
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

const getMyOrganizations = publicProcedure.query(async ({ctx}) => {
  if (!ctx.auth?.userId) {
    return null;
  }

  return ctx.prisma.organization.findMany({
    where: {
      users: {
        some: {
          externalId: ctx.auth.userId,
        },
      },
    },
  });
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
        disabled: true,
      },
    });
  });

const getMyOrganizationMembers = protectedProcedure
  .input(
    z.object({
      organizationId: z.string().uuid(),
    })
  )
  .query(async ({ctx, input}) => {
    const organization = await ctx.prisma.organization.findFirst({
      where: {
        id: input.organizationId,
      },
    });

    if (!organization) {
      return [];
    }

    return ctx.prisma.user.findMany({
      where: {
        organizations: {
          some: {
            id: organization.id,
          },
        },
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
    const user = await getUserByEmail(ctx)({
      email: input.userEmail,
    });

    invariant(user, userNotFoundError);

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
    const organization = await getOrganizationWithMembersByOrganizationId(ctx)({
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
        organizations: {
          disconnect: {
            id: input.organizationId,
          },
        },
      },
    });
  });

export const organizationRouter = createTRPCRouter({
  create,
  update,
  remove,
  getMyOrganizationMembers,
  getOrganizationById,
  addOrganizationMember,
  removeOrganizationMember,
  getMyOrganizations,
});
