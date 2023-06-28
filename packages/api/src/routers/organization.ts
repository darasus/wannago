import {TRPCError} from '@trpc/server';
import {userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {createTRPCRouter, publicProcedure, protectedProcedure} from '../trpc';
import {getUserByExternalId} from '../actions/getUserByExternalId';
import {getOrganizationByUserExternalId} from '../actions/getOrganizationByUserExternalId';
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
    const user = await getUserByExternalId(ctx)({
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
          email: input.email,
          preferredCurrency: input.currency,
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
          email: input.email,
          preferredCurrency: input.currency,
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

const getMyOrganization = publicProcedure.query(async ({ctx}) => {
  if (!ctx.auth?.userId) {
    return null;
  }

  return getOrganizationByUserExternalId(ctx)({
    externalId: ctx.auth.userId,
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
    select: {
      id: true,
      name: true,
      logoSrc: true,
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

const getMyOrganizationMembers = protectedProcedure.query(async ({ctx}) => {
  const organization = await getOrganizationByUserExternalId(ctx)({
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
    const user = await getUserByEmail(ctx)({
      email: input.userEmail,
    });

    const businessSubscription = await ctx.prisma.subscription.findFirst({
      where: {
        organization: {
          some: {
            users: {
              some: {
                id: user?.id,
              },
            },
          },
        },
      },
    });

    ctx.assertions.assertCanAddOrganizationMember({
      subscription: businessSubscription,
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
        organization: {
          disconnect: true,
        },
      },
    });
  });

export const organizationRouter = createTRPCRouter({
  create,
  remove,
  getMyOrganization,
  getMyOrganizationMembers,
  getOrganizationById,
  addOrganizationMember,
  removeOrganizationMember,
  getMyOrganizations,
});
