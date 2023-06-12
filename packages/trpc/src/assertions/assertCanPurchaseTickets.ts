import {Event} from '@prisma/client';
import {AssertionContext} from '../context';
import {Ticket, TicketSale} from '@prisma/client';
import {invariant} from 'utils';
import {TRPCError} from '@trpc/server';

export function assertCanPurchaseTickets(ctx: AssertionContext) {
  return ({
    event,
    requestedTickets,
  }: {
    event: Event & {tickets: Ticket[]; ticketSales: TicketSale[]};
    requestedTickets: {ticketId: string; quantity: number}[];
  }) => {
    return requestedTickets.every(
      ({ticketId: requestedTicketId, quantity: requestedQuantity}) => {
        const ticket = event.tickets.find(t => t.id === requestedTicketId);

        invariant(
          ticket,
          new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Ticket not found',
          })
        );

        const ticketSales = event.ticketSales.filter(
          ts => ts.ticketId === requestedTicketId
        );
        const quantitySold = ticketSales.reduce(
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
  };
}
