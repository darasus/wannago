import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';

export const getById = protectedProcedure
  .input(
    z.object({
      eventId: z.string().min(1),
    })
  )
  .query(async ({input: {eventId}, ctx}) => {
    await ctx.actions.canModifyEvent({eventId});

    return ctx.prisma.event.findFirst({
      where: {
        id: eventId,
      },
      include: {
        user: true,
      },
    });
  });
