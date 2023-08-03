import {TRPCError} from '@trpc/server';
import {eventNotFoundError, userNotFoundError} from 'error';
import {getBaseUrl, invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpc';
import {Stripe} from 'lib/src/stripe';
import {assertCanPurchaseTickets} from '../../assertions/assertCanPurchaseTickets';
import {feeAmount, feePercent} from 'const';

export const createCheckoutSession = protectedProcedure
  .input(
    z.object({
      userId: z.string().uuid(),
      eventId: z.string().uuid(),
      tickets: z.array(
        z.object({
          ticketId: z.string().uuid(),
          quantity: z.number().int().positive(),
        })
      ),
    })
  )
  .mutation(async ({ctx, input}) => {
    const stripe = new Stripe().client;
    const customer = await ctx.prisma.user.findFirst({
      where: {
        OR: [
          {
            id: input.userId,
          },
          {
            externalId: ctx.auth.userId,
          },
        ],
      },
    });
    const event = await ctx.prisma.event.findUnique({
      where: {
        id: input.eventId,
      },
      include: {
        organization: true,
        user: true,
        tickets: true,
        ticketSales: true,
      },
    });

    invariant(event, eventNotFoundError);

    await assertCanPurchaseTickets(ctx)({
      event,
      requestedTickets: input.tickets,
    });

    const stripeLinkedAccountId =
      event?.organization?.stripeLinkedAccountId ||
      event?.user?.stripeLinkedAccountId;

    invariant(customer, userNotFoundError);
    invariant(
      stripeLinkedAccountId,
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Stripe account id is required',
      })
    );

    let stripeCustomerId = customer.stripeCustomerId || undefined;

    if (!customer.stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
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

    invariant(
      stripeCustomerId,
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Stripe customer id is required',
      })
    );

    const email = customer.email;

    invariant(
      email,
      new TRPCError({code: 'BAD_REQUEST', message: 'Email is required'})
    );

    const selectedTickets = await ctx.prisma.ticket.findMany({
      where: {
        id: {
          in: input.tickets.map((ticket) => ticket.ticketId),
        },
      },
    });

    const totalAmount = input.tickets.reduce((acc, ticket) => {
      const {price} =
        selectedTickets.find((t) => t.id === ticket.ticketId) || {};

      if (!price) {
        return acc;
      }

      return acc + ticket.quantity * price;
    }, 0);

    const successCallbackUrl = `${getBaseUrl()}/e/${
      event.shortId
    }/my-tickets?success=true`;
    const cancelCallbackUrl = `${getBaseUrl()}/e/${event.shortId}`;

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      customer_email: stripeCustomerId ? undefined : email,
      customer_update: stripeCustomerId
        ? {
            name: 'auto',
            address: 'auto',
          }
        : undefined,
      billing_address_collection: 'auto',
      line_items: selectedTickets.map((ticket) => {
        return {
          quantity: input.tickets.find((t) => t.ticketId === ticket.id)
            ?.quantity,
          price_data: {
            product_data: {
              name: ticket.title,
            },
            currency: event.preferredCurrency || 'USD',
            unit_amount: ticket.price,
          },
        };
      }),
      mode: 'payment',
      success_url: successCallbackUrl,
      cancel_url: cancelCallbackUrl,
      tax_id_collection: {
        enabled: true,
      },
      allow_promotion_codes: false,
      metadata: {
        externalUserId: ctx.auth.userId,
        eventId: input.eventId,
        tickets: JSON.stringify(
          input.tickets.map((t) => {
            return {
              ticketId: t.ticketId,
              quantity: t.quantity,
            };
          })
        ),
      },
      payment_intent_data: {
        application_fee_amount: calculateFee(totalAmount),
        transfer_data: {
          destination: stripeLinkedAccountId,
        },
      },
    });

    return session.url;
  });

function calculateFee(totalAmountInCents: number) {
  const feeInCents = totalAmountInCents * feePercent + feeAmount;

  return Math.round(feeInCents);
}
