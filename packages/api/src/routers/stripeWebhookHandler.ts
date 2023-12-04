import {createTRPCRouter, publicProcedure} from '../trpc';
import {handleCheckoutSessionCompletedInputSchema} from 'stripe-webhook-input-validation';
import * as s from 'stripe';
import {invariant} from 'utils';
import {userNotFoundError} from 'error';
import {z} from 'zod';
import {TicketSale} from '@prisma/client';
import {stripe} from 'lib/src/stripe';

const checkoutCompleteMetadataSchema = z.array(z.string().uuid());

const handleCheckoutSessionCompleted = publicProcedure
  .input(handleCheckoutSessionCompletedInputSchema)
  .query(async ({ctx, input}) => {
    console.log('==>>>> here', input);
    if (input.data.object.status !== 'complete') {
      return {success: true};
    }

    const customer = (await stripe.customers.retrieve(
      input.data.object.customer
    )) as s.Stripe.Customer;

    invariant(customer.email, 'Customer email is required');

    const user = await ctx.actions.getUserById({
      id: input.data.object.metadata.externalUserId,
    });

    invariant(user, userNotFoundError);

    const ticketSaleIds = checkoutCompleteMetadataSchema.parse(
      JSON.parse(input.data.object.metadata.ticketSaleIds)
    );

    const result = await ctx.prisma.$transaction(async (prisma) => {
      let ticketSales: TicketSale[] = [];

      for (const ticketSaleId of ticketSaleIds) {
        const ticketSale = await prisma.ticketSale.update({
          where: {
            id: ticketSaleId,
          },
          data: {
            status: 'COMPLETED',
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

    return result;
  });

export const stripeWebhookHandlerRouter = createTRPCRouter({
  handleCheckoutSessionCompleted,
});
