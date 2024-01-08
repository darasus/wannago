import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

export const getMyEvents = protectedProcedure
  .input(
    z.object({
      onlyPast: z.boolean().optional(),
      eventType: z.enum(['attending', 'organizing', 'all']),
    })
  )
  .query(async ({ctx, input}) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.auth?.user?.id,
      },
    });

    const authorIds = [user?.id].filter(Boolean) as string[];

    return ctx.actions.getEvents({
      authorIds,
      eventType: input.eventType,
      onlyPast: input.onlyPast,
    });
  });
