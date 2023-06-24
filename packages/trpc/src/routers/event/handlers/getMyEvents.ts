import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';

export const getMyEvents = protectedProcedure
  .input(
    z.object({
      onlyPast: z.boolean().optional(),
      eventType: z.enum(['attending', 'organizing', 'following', 'all']),
    })
  )
  .query(async ({ctx, input}) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth.userId,
      },
      include: {
        organization: true,
      },
    });

    const authorIds = [user?.id, user?.organization?.id].filter(
      Boolean
    ) as string[];

    return ctx.actions.getEvents({
      authorIds,
      eventType: input.eventType,
      onlyPast: input.onlyPast,
    });
  });
