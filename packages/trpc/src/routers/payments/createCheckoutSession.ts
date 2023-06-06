import {TRPCError} from '@trpc/server';
import {eventNotFoundError, userNotFoundError} from 'error';
import {getBaseUrl, invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../trpcServer';

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
  .mutation(async ({ctx, input}) => {
    const customer = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth.userId,
    });
    const event = await ctx.prisma.event.findUnique({
      where: {
        id: input.eventId,
      },
      include: {
        organization: true,
        user: true,
      },
    });
    const stripeLinkedAccountId =
      event?.organization?.stripeLinkedAccountId ||
      event?.user?.stripeLinkedAccountId;

    invariant(customer, userNotFoundError);
    invariant(event, eventNotFoundError);
    invariant(
      stripeLinkedAccountId,
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Stripe account id is required',
      })
    );

    const stripeCustomerId = customer.stripeCustomerId || undefined;
    const email = customer.email;

    invariant(
      email,
      new TRPCError({code: 'BAD_REQUEST', message: 'Email is required'})
    );

    const selectedTickets = await ctx.prisma.ticket.findMany({
      where: {
        id: {
          in: input.tickets.map(ticket => ticket.ticketId),
        },
      },
    });

    const successCallbackUrl = `${getBaseUrl()}/e/${
      event.shortId
    }/my-tickets?success=true`;
    const cancelCallbackUrl = `${getBaseUrl()}/e/${event.shortId}`;

    const session = await ctx.stripe.stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      customer_email: stripeCustomerId ? undefined : email,
      customer_update: stripeCustomerId
        ? {
            name: 'auto',
            address: 'auto',
          }
        : undefined,
      billing_address_collection: 'auto',
      line_items: selectedTickets.map(ticket => {
        return {
          quantity: input.tickets.find(t => t.ticketId === ticket.id)?.quantity,
          price_data: {
            product_data: {
              name: ticket.title,
            },
            currency: ctx.currency.toLocaleLowerCase(),
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
          input.tickets.map(t => {
            return {
              ticketId: t.ticketId,
              quantity: t.quantity,
            };
          })
        ),
      },
      payment_intent_data: {
        application_fee_amount: 123,
        transfer_data: {
          destination: stripeLinkedAccountId,
        },
      },
    });

    return session.url;
  });
