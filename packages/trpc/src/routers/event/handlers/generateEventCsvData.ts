import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';
import {formatCents, invariant} from 'utils';
import {capitalCase} from 'change-case';

export const generateEventCsvData = protectedProcedure
  .input(
    z.object({
      eventShortId: z.string(),
    })
  )
  .mutation(async ({input: {eventShortId}, ctx}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: eventShortId,
      },
      include: {
        eventSignUps: {
          include: {
            user: true,
          },
        },
        tickets: true,
        ticketSales: {
          include: {
            user: true,
          },
        },
      },
    });

    const isPaidEvent = event?.tickets && event?.tickets.length > 0;

    if (isPaidEvent) {
      const ticketSales = event?.ticketSales;
      const tickets = event?.tickets;

      const data = ticketSales?.map((ticketSale, i) => {
        const ticket = tickets.find(
          ticket => ticket.id === ticketSale.ticketId
        )!;

        return {
          '#': i + 1,
          name: ticketSale.user.firstName + ' ' + ticketSale.user.lastName,
          email: ticketSale.user.email,
          ticketName: ticket.title,
          quantity: ticketSale.quantity,
          ticketPrice: formatCents(ticket.price, event.preferredCurrency),
        };
      });

      return generateCsvFromData(data);
    }

    const eventSignUps = event?.eventSignUps;

    const data = eventSignUps?.map((signUp, i) => {
      return {
        '#': i + 1,
        name: signUp.user.firstName + ' ' + signUp.user.lastName,
        email: signUp.user.email,
        hasPlusOne: signUp.hasPlusOne ? 'Yes' : 'No',
        status: signUp.status,
      };
    });

    invariant(data, 'No data found');

    return generateCsvFromData(data);
  });

function generateCsvFromData(data: Array<Record<string, string | number>>) {
  const header =
    Object.keys(data[0])
      .map(key => {
        if (key === '#') {
          return key;
        } else {
          return capitalCase(key);
        }
      })
      .join(',') + '\r\n';

  const rows = data
    ?.map(item => {
      const values = Object.values(item);
      return values.join(',');
    })
    .join('\r\n');

  return header + rows;
}
