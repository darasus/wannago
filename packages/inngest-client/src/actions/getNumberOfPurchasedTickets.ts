import {ActionParams} from '../types';

export function getNumberOfPurchasedTickets({ctx}: ActionParams) {
  return async ({ticketSaleIds}: {ticketSaleIds: string[]}) => {
    const ticketSales = await ctx.prisma.ticketSale.findMany({
      where: {
        id: {
          in: ticketSaleIds,
        },
        status: 'COMPLETED',
      },
    });

    if (ticketSales.length === 0) {
      throw new Error('Ticket sale not found');
    }

    const numberOfPurchasedTickets = ticketSales.reduce(
      (acc, ticketSale) => acc + ticketSale.quantity,
      0
    );

    return {numberOfPurchasedTickets};
  };
}
