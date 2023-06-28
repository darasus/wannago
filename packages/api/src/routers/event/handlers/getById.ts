import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';
import {canModifyEvent} from '../../../actions/canModifyEvent';

export const getById = protectedProcedure
  .input(
    z.object({
      eventId: z.string().min(1),
    })
  )
  .query(async ({input: {eventId}, ctx}) => {
    await canModifyEvent(ctx)({eventId});

    return ctx.prisma.event.findFirst({
      where: {
        id: eventId,
      },
      include: {
        user: true,
      },
    });
  });
