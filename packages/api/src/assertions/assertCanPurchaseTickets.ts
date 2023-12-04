import {AssertionContext} from '../context';
import {invariant} from 'utils';
import {TRPCError} from '@trpc/server';

export function assertCanPurchaseTickets(ctx: AssertionContext) {
  return async ({
    requestedTickets,
    eventId,
  }: {
    requestedTickets: {ticketId: string; quantity: number}[];
    eventId: string;
  }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      const tickets = await prisma.ticket.findMany({
        where: {
          eventId,
        },
      });
      const ticketSales = await prisma.ticketSale.findMany({
        where: {
          eventId,
        },
      });

      return requestedTickets.every(
        ({ticketId: requestedTicketId, quantity: requestedQuantity}) => {
          const ticket = tickets.find((t) => t.id === requestedTicketId);

          invariant(
            ticket,
            new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Ticket not found',
            })
          );

          const ticketSale = ticketSales.filter(
            (ts) => ts.ticketId === requestedTicketId
          );
          const quantitySold = ticketSale.reduce(
            (acc, ts) => acc + ts.quantity,
            0
          );

          if (quantitySold >= ticket.maxQuantity) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Ticket is sold out.',
            });
          }

          if (requestedQuantity + quantitySold > ticket.maxQuantity) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Requested quantity exceeds available quantity.',
            });
          }

          return true;
        }
      );
    });
  };
}
