import {eventNotFoundError, userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';

export const getMyTicketsByEvent = protectedProcedure
  .input(
    z.object({
      eventShortId: z.string(),
    })
  )
  .query(async ({ctx, input}) => {
    const user = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth.userId,
    });
    const event = await ctx.prisma.event.findUnique({
      where: {
        shortId: input.eventShortId,
      },
    });

    invariant(user, userNotFoundError);
    invariant(event, eventNotFoundError);

    const ticketSales = await ctx.prisma.ticketSale.findMany({
      where: {
        userId: user.id,
        eventId: event.id,
      },
      include: {
        ticket: true,
      },
    });

    return ticketSales;
  });
