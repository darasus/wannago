import {userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpc';
import {TRPCError} from '@trpc/server';

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

    let stripeCustomerId = customer.stripeCustomerId || undefined;

    if (!customer.stripeCustomerId) {
      const stripeCustomer = await ctx.stripe.customers.create({
        email: customer.email,
      });

      stripeCustomerId = stripeCustomer.id;

      await ctx.prisma.user.update({
        where: {
          id: customer.id,
        },
        data: {
          stripeCustomerId,
        },
      });
    }

    const url = await ctx.prisma.$transaction(async (prisma) => {
      invariant(
        stripeCustomerId,
        new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Stripe customer ID is required',
        })
      );

      const ticketSaleIds = [];

      for (const ticket of tickets) {
        const ticketSale = await ctx.prisma.ticketSale.create({
          data: {
            eventId,
            ticketId: ticket.ticketId,
            quantity: ticket.quantity,
            userId: customer.id,
          },
        });

        ticketSaleIds.push(ticketSale.id);
      }

      const session = await ctx.actions.createCheckoutSession({
        email: customer.email,
        eventId,
        stripeCustomerId,
        tickets,
        prisma,
        ticketSaleIds,
      });

      return session.url;
    });

    return url;
  });
