import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

export const getById = protectedProcedure
  .input(
    z.object({
      eventId: z.string().min(1),
    })
  )
  .query(async ({input: {eventId}, ctx}) => {
    return ctx.prisma.event.findFirst({
      where: {
        id: eventId,
      },
    });
  });
