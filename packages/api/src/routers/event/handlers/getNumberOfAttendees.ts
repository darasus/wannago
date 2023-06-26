import {eventNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {publicProcedure} from '../../../trpc';

export const getNumberOfAttendees = publicProcedure
  .input(z.object({eventId: z.string().uuid()}))
  .query(async ({input, ctx}) => {
    const event = await ctx.prisma.event.findUnique({
      where: {id: input.eventId},
      include: {
        tickets: true,
        ticketSales: true,
        eventSignUps: {
          where: {
            status: 'REGISTERED',
          },
        },
      },
    });

    invariant(event, eventNotFoundError);

    const isPaidEvent = event.tickets.length > 0;

    if (isPaidEvent) {
      return {
        count: event.ticketSales.reduce((acc, next) => {
          return acc + next.quantity;
        }, 0),
      };
    }

    return {
      count: event.eventSignUps.reduce((acc, next) => {
        if (next.hasPlusOne) {
          return acc + 2;
        }

        return acc + 1;
      }, 0),
    };
  });
