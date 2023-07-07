import {eventNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';
import {canModifyEvent} from '../../../actions/canModifyEvent';

export const getAttendees = protectedProcedure
  .input(z.object({eventShortId: z.string()}))
  .query(async ({input, ctx}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.eventShortId,
      },
    });

    invariant(event, eventNotFoundError);

    await canModifyEvent(ctx)({eventId: event.id});

    return ctx.prisma.eventSignUp.findMany({
      where: {
        eventId: event.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        event: true,
        ticketSales: {
          include: {
            ticket: true,
          },
        },
      },
    });
  });
