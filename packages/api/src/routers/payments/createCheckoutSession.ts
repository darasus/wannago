import {checkoutSessionNotFound, userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpc';
import {add} from 'date-fns';

export const createCheckoutSession = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
      tickets: z.array(
        z.object({
          ticketId: z.string().uuid(),
          quantity: z.number().int().positive(),
        })
      ),
    })
  )
  .mutation(async ({ctx, input: {eventId, tickets}}) => {
    await ctx.assertions.assertCanPurchaseTickets({
      eventId: eventId,
      requestedTickets: tickets,
    });

    const customer = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.auth?.user?.id,
      },
    });

    invariant(customer, userNotFoundError);

    const checkoutSession = await ctx.prisma.$transaction(async (prisma) => {
      const ticketSaleIds = [];

      for (const ticket of tickets) {
        const ticketSale = await ctx.prisma.ticketSale.create({
          data: {
            eventId,
            ticketId: ticket.ticketId,
            quantity: ticket.quantity,
            userId: customer.id,
            status: 'PENDING',
          },
        });

        ticketSaleIds.push(ticketSale.id);
      }

      const checkoutSession = await ctx.prisma.checkoutSession.create({
        data: {
          userId: customer.id,
          expires: add(new Date(), {minutes: 15}),
          ticketSales: {
            connect: ticketSaleIds.map((id) => ({id})),
          },
          eventId: eventId,
        },
      });

      invariant(checkoutSession, checkoutSessionNotFound);

      await ctx.inngest.send({
        name: 'stripe/ticket.purchase-intent.created',
        data: {
          eventId: eventId,
          userId: customer.id,
          checkoutSessionId: checkoutSession.id,
        },
      });

      return checkoutSession;
    });

    return {checkoutSessionId: checkoutSession.id};
  });
