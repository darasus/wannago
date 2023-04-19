import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';

export const remove = protectedProcedure
  .input(
    z.object({
      eventId: z.string().min(1),
    })
  )
  .mutation(async ({input: {eventId}, ctx}) => {
    await ctx.actions.canModifyEvent({eventId});

    const event = await ctx.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        eventSignUps: true,
      },
    });

    await ctx.prisma.eventSignUp.deleteMany({
      where: {
        eventId,
      },
    });

    return ctx.prisma.event.delete({
      where: {
        id: eventId,
      },
    });
  });
