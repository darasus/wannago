import {eventNotFoundError} from 'error';
import {omit} from 'ramda';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

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

    const eventSignUps = await ctx.prisma.eventSignUp.findMany({
      where: {
        eventId: event.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        ticketSales: {
          include: {
            ticket: true,
          },
        },
      },
    });

    return eventSignUps.map(eventSignUp => {
      const tickets: {
        [id: string]: {
          quantity: number;
          id: string;
          title: string;
          description: string | null;
        };
      } = {};

      for (const ticketSale of eventSignUp.ticketSales) {
        if (!tickets[ticketSale.ticketId]) {
          tickets[ticketSale.ticketId] = {
            id: ticketSale.ticket.id,
            title: ticketSale.ticket.title,
            description: ticketSale.ticket.description,
            quantity: ticketSale.quantity,
          };
        } else {
          tickets[ticketSale.ticketId].quantity += ticketSale.quantity;
        }
      }

      return {
        ...omit(['ticketSales'], eventSignUp),
        tickets,
      };
    });
  });
