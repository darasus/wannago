import {createTRPCRouter, publicProcedure} from '../trpc';
import {handleCheckoutSessionCompletedInputSchema} from 'stripe-webhook-input-validation';
import * as s from 'stripe';
import {invariant} from 'utils';
import {userNotFoundError} from 'error';
import {z} from 'zod';
import {TicketSale} from '@prisma/client';
import {Stripe} from 'lib/src/stripe';

const checkoutCompleteMetadataSchema = z.array(
  z.object({
    ticketId: z.string().uuid(),
    quantity: z.number().int(),
  })
);

const handleCheckoutSessionCompleted = publicProcedure
  .input(handleCheckoutSessionCompletedInputSchema)
  .query(async ({ctx, input}) => {
    const stripe = new Stripe().client;

    if (input.data.object.status !== 'complete') return {success: true};

    const customer = (await stripe.customers.retrieve(
      input.data.object.customer
    )) as s.Stripe.Customer;

    invariant(customer.email, 'Customer email is required');

    const user = await ctx.actions.getUserById({
      id: input.data.object.metadata.externalUserId,
    });

    invariant(user, userNotFoundError);

    const tickets = checkoutCompleteMetadataSchema.parse(
      JSON.parse(input.data.object.metadata.tickets)
    );

    let ticketSales: TicketSale[] = [];

    await ctx.prisma.$transaction(async (prisma) => {
      for (const ticket of tickets) {
        const ticketSale = await prisma.ticketSale.create({
          data: {
            quantity: ticket.quantity,
            ticketId: ticket.ticketId,
            userId: user.id,
            eventId: input.data.object.metadata.eventId,
          },
        });

        ticketSales.push(ticketSale);
      }

      const eventSignUp = await prisma.eventSignUp.findFirst({
        where: {
          userId: user.id,
          eventId: input.data.object.metadata.eventId,
        },
      });

      if (eventSignUp) {
        await prisma.eventSignUp.update({
          where: {
            id: eventSignUp.id,
          },
          data: {
            userId: user.id,
            eventId: input.data.object.metadata.eventId,
            status: 'REGISTERED',
            ticketSales: {
              connect: ticketSales.map((ticketSale) => ({
                id: ticketSale.id,
              })),
            },
          },
        });
      } else {
        await prisma.eventSignUp.create({
          data: {
            userId: user.id,
            eventId: input.data.object.metadata.eventId,
            status: 'REGISTERED',
            ticketSales: {
              connect: ticketSales.map((ticketSale) => ({
                id: ticketSale.id,
              })),
            },
          },
        });
      }
    });

    await ctx.inngest.send({
      name: 'stripe/tickets.purchased',
      data: {
        userId: user.id,
        eventId: input.data.object.metadata.eventId,
        ticketSaleIds: ticketSales.map((ticketSale) => ticketSale.id),
      },
    });

    return {success: true};
  });

export const stripeWebhookHandlerRouter = createTRPCRouter({
  handleCheckoutSessionCompleted,
});
