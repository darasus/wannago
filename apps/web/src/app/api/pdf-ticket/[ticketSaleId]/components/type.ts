import {Event, Ticket, TicketSale, User} from '@prisma/client';

export interface PDFProps {
  ticketSale: TicketSale & {
    ticket: Ticket;
    event: Event;
    user: User;
  };
}
