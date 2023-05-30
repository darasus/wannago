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
    const user = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth.userId,
    });
    const event = await ctx.actions.getEvent({id: input.eventId});

    invariant(user, userNotFoundError);
    invariant(event, eventNotFoundError);
    invariant(
      user.stripeLinkedAccountId,
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Stripe customer id is required',
      })
    );

    const stripeCustomerId = user.stripeCustomerId || undefined;
    const email = user.email;

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
            currency: 'usd',
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
          destination: user.stripeLinkedAccountId,
        },
      },
    });

    return session.url;
  });
