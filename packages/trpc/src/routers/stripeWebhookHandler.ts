import {router, publicProcedure} from '../trpcServer';
import {
  handleCustomerSubscriptionCreatedInputSchema,
  handleCustomerSubscriptionUpdatedInputSchema,
  handleCustomerSubscriptionDeletedInputSchema,
  handleCheckoutSessionCompletedInputSchema,
} from 'stripe-webhook-input-validation';
import * as s from 'stripe';
import {invariant, isOrganization, isUser} from 'utils';
import {organizerNotFoundError, userNotFoundError} from 'error';
import {z} from 'zod';
import {TicketSale} from '@prisma/client';

const handleCustomerSubscriptionCreated = publicProcedure
  .input(handleCustomerSubscriptionCreatedInputSchema)
  .query(async ({ctx, input}) => {
    return {success: true};
  });

const handleCustomerSubscriptionUpdated = publicProcedure
  .input(handleCustomerSubscriptionUpdatedInputSchema)
  .query(async ({ctx, input}) => {
    if (input.data.object.status !== 'active') return {success: true};

    const customer = (await ctx.stripe.client.customers.retrieve(
      input.data.object.customer
    )) as s.Stripe.Customer;

    invariant(customer.email, 'Customer email is required');

    const organizer = await ctx.actions.getOrganizerByEmail({
      email: customer.email,
    });

    invariant(organizer, organizerNotFoundError);

    if (
      input.data.object.cancellation_details?.reason ===
      'cancellation_requested'
    ) {
      const subscription = await ctx.prisma.subscription.findFirst({
        where: {
          OR: [
            {
              user: {
                some: {
                  id: organizer.id,
                },
              },
            },
            {
              organization: {
                some: {
                  id: organizer.id,
                },
              },
            },
          ],
        },
      });
      if (isUser(organizer)) {
        await ctx.prisma.subscription.update({
          where: {
            id: subscription?.id,
          },
          data: {
            cancelAt: input.data.object.cancel_at
              ? new Date(input.data.object.cancel_at * 1000)
              : null,
          },
        });
      }
      if (isOrganization(organizer)) {
        await ctx.prisma.subscription.update({
          where: {
            id: subscription?.id,
          },
          data: {
            cancelAt: input.data.object.cancel_at
              ? new Date(input.data.object.cancel_at * 1000)
              : null,
          },
        });
      }

      return {success: true};
    }

    if (!organizer.subscriptionId) {
      if (isUser(organizer)) {
        await ctx.prisma.user.update({
          where: {
            id: organizer.id,
          },
          data: {stripeCustomerId: customer.id},
        });
      }
      if (isOrganization(organizer)) {
        await ctx.prisma.organization.update({
          where: {
            id: organizer.id,
          },
          data: {stripeCustomerId: customer.id},
        });
      }
    }

    await ctx.prisma.subscription.create({
      data: {
        type: isUser(organizer) ? 'PRO' : 'BUSINESS',
        ...(isUser(organizer)
          ? {
              user: {
                connect: {
                  id: organizer.id,
                },
              },
            }
          : {}),
        ...(isOrganization(organizer)
          ? {
              organization: {
                connect: {
                  id: organizer.id,
                },
              },
            }
          : {}),
      },
    });

    return {success: true};
  });

const handleCustomerSubscriptionDeleted = publicProcedure
  .input(handleCustomerSubscriptionDeletedInputSchema)
  .query(async ({ctx, input}) => {
    if (input.data.object.status !== 'canceled') return {success: true};

    const customer = (await ctx.stripe.client.customers.retrieve(
      input.data.object.customer
    )) as s.Stripe.Customer;

    invariant(customer.email, 'Customer email is required');

    const organizer = await ctx.actions.getOrganizerByEmail({
      email: customer.email,
    });

    invariant(organizer, organizerNotFoundError);

    if (organizer.subscriptionId) {
      await ctx.prisma.subscription.delete({
        where: {
          id: organizer.subscriptionId,
        },
      });
    }

    return {success: true};
  });

const checkoutCompleteMetadataSchema = z.array(
  z.object({
    ticketId: z.string().uuid(),
    quantity: z.number().int(),
  })
);

const handleCheckoutSessionCompleted = publicProcedure
  .input(handleCheckoutSessionCompletedInputSchema)
  .query(async ({ctx, input}) => {
    if (input.data.object.status !== 'complete') return {success: true};

    const customer = (await ctx.stripe.client.customers.retrieve(
      input.data.object.customer
    )) as s.Stripe.Customer;

    invariant(customer.email, 'Customer email is required');

    const user = await ctx.actions.getUserByExternalId({
      externalId: input.data.object.metadata.externalUserId,
    });

    invariant(user, userNotFoundError);

    const tickets = checkoutCompleteMetadataSchema.parse(
      JSON.parse(input.data.object.metadata.tickets)
    );

    let ticketSales: TicketSale[] = [];

    for (const ticket of tickets) {
      const ticketSale = await ctx.prisma.ticketSale.create({
        data: {
          quantity: ticket.quantity,
          ticketId: ticket.ticketId,
          userId: user.id,
          eventId: input.data.object.metadata.eventId,
        },
      });
      ticketSales = [...ticketSales, ticketSale];
    }

    const eventSignUp = await ctx.prisma.eventSignUp.findFirst({
      where: {
        userId: user.id,
        eventId: input.data.object.metadata.eventId,
      },
    });

    if (eventSignUp) {
      await ctx.prisma.eventSignUp.update({
        where: {
          id: eventSignUp?.id,
        },
        data: {
          userId: user.id,
          eventId: input.data.object.metadata.eventId,
          ticketSales: {
            connect: ticketSales.map(ticketSale => ({
              id: ticketSale.id,
            })),
          },
        },
      });
    } else {
      await ctx.prisma.eventSignUp.create({
        data: {
          userId: user.id,
          eventId: input.data.object.metadata.eventId,
          ticketSales: {
            connect: ticketSales.map(ticketSale => ({
              id: ticketSale.id,
            })),
          },
        },
      });
    }

    return {success: true};
  });

export const stripeWebhookHandlerRouter = router({
  handleCustomerSubscriptionCreated,
  handleCustomerSubscriptionUpdated,
  handleCustomerSubscriptionDeleted,
  handleCheckoutSessionCompleted,
});
