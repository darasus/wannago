import {eventNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';

export const getAttendees = protectedProcedure
  .input(z.object({eventShortId: z.string()}))
  .query(async ({input, ctx}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.eventShortId,
      },
    });

    invariant(event, eventNotFoundError);

    await ctx.actions.canModifyEvent({eventId: event.id});

    return ctx.prisma.eventSignUp.findMany({
      where: {
        eventId: event.id,
      },
      include: {
        user: true,
        ticketSales: {
          include: {
            ticket: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });
