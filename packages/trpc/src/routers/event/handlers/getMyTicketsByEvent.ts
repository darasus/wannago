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

    const tickets = await ctx.prisma.ticket.findMany({
      where: {
        eventId: event.id,
      },
      include: {
        ticketSales: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    const response = tickets
      .map(ticket => {
        return {
          id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          price: ticket.price,
          quantity: ticket.ticketSales.reduce(
            (acc, ticketSale) => acc + ticketSale.quantity,
            0
          ),
        };
      })
      .filter(ticket => ticket.quantity > 0);

    if (response.length === 0) {
      return null;
    }

    return response;
  });
