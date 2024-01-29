import {TRPCError} from '@trpc/server';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

export const remove = protectedProcedure
  .input(
    z.object({
      eventId: z.string().min(1),
    })
  )
  .mutation(async ({input: {eventId}, ctx}) => {
    const ticketSales = await ctx.prisma.ticketSale.count({
      where: {
        eventId,
      },
    });

    if (ticketSales > 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cannot delete an event that has ticket sales',
      });
    }

    await ctx.prisma.ticket.deleteMany({
      where: {
        eventId,
      },
    });

    await ctx.prisma.eventSignUp.deleteMany({
      where: {
        eventId,
      },
    });

    const event = await ctx.prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    await ctx.inngest.send({
      name: 'event.removed',
      data: {eventId: eventId},
    });

    return event;
  });
