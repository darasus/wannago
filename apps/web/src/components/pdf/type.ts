import {Event, Organization, Ticket, TicketSale, User} from '@prisma/client';

export interface PDFProps {
  ticketSale: TicketSale & {
    ticket: Ticket;
    event: Event & {user: User | null; organization: Organization | null};
    user: User;
  };
}
