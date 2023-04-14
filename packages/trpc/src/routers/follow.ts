import {TRPCError} from '@trpc/server';
import {userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {router, protectedProcedure, publicProcedure} from '../trpcServer';

const follow = protectedProcedure
  .input(
    z.object({
      userId: z.string().uuid().optional(),
      organizationId: z.string().uuid().optional(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const session = await ctx.actions.getActiveSessionType();

    invariant(
      session === 'user',
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Only users can follow',
      })
    );

    const me = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth?.userId,
    });

    invariant(me, userNotFoundError);

    if (input.userId === me.id) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You cannot follow yourself',
      });
    }

    return ctx.prisma.follow.create({
      data: {
        followerUser: {
          connect: {
            id: me.id,
          },
        },
        ...(input.userId
          ? {
              followingUser: {
                connect: {
                  id: input.userId,
                },
              },
            }
          : {}),
        ...(input.organizationId
          ? {
              followingOrganization: {
                connect: {
                  id: input.organizationId,
                },
              },
            }
          : {}),
      },
    });
  });

const unfollow = protectedProcedure
  .input(
    z.object({
      userId: z.string().uuid().optional(),
      organizationId: z.string().uuid().optional(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const session = await ctx.actions.getActiveSessionType();

    invariant(
      session === 'user',
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Only users can follow',
      })
    );

    const me = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth?.userId,
    });

    invariant(me, userNotFoundError);

    const follow = await ctx.prisma.follow.findFirst({
      where: {
        followerUser: {
          id: me.id,
        },
        ...(input.userId
          ? {
              followingUser: {
                id: input.userId,
              },
            }
          : {}),
        ...(input.organizationId
          ? {
              followingOrganization: {
                id: input.organizationId,
              },
            }
          : {}),
      },
    });

    invariant(follow, new TRPCError({code: 'NOT_FOUND'}));

    return ctx.prisma.follow.delete({
      where: {
        id: follow.id,
      },
    });
  });

const getFollowCounts = publicProcedure
  .input(
    z.object({
      userId: z.string().uuid().optional(),
      organizationId: z.string().uuid().optional(),
    })
  )
  .query(async ({ctx, input}) => {
    if (input.userId) {
      const [followerCount, followingCount] = await Promise.all([
        ctx.prisma.follow.count({
          where: {
            followingUserId: input.userId,
          },
        }),
        ctx.prisma.follow.count({
          where: {
            followerUserId: input.userId,
          },
        }),
      ]);

      return {
        followingCount,
        followerCount,
      };
    }

    if (input.organizationId) {
      const [followerCount] = await Promise.all([
        ctx.prisma.follow.count({
          where: {
            followingOrganizationId: input.organizationId,
          },
        }),
      ]);

      return {
        followingCount: null,
        followerCount,
      };
    }

    return null;
  });

const amFollowing = publicProcedure
  .input(
    z.object({
      userId: z.string().uuid().optional(),
      organizationId: z.string().uuid().optional(),
    })
  )
  .query(async ({ctx, input}) => {
    if (!ctx.auth?.userId) {
      return null;
    }

    const session = await ctx.actions.getActiveSessionType();

    // organizations can not follow others
    if (session === 'organization') {
      return null;
    }

    const me = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth?.userId,
    });

    invariant(me, userNotFoundError);

    if (input.userId) {
      const follow = await ctx.prisma.follow.findFirst({
        where: {
          followingUserId: input.userId,
          followerUserId: me.id,
        },
      });

      return Boolean(follow);
    }

    if (input.organizationId) {
      const follow = await ctx.prisma.follow.findFirst({
        where: {
          followingOrganizationId: input.organizationId,
          followerUserId: me.id,
        },
      });

      return Boolean(follow);
    }

    return null;
  });

export const followRouter = router({
  follow,
  unfollow,
  getFollowCounts,
  amFollowing,
});
