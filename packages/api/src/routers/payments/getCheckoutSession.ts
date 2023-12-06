import {z} from 'zod';
import {protectedProcedure} from '../../trpc';
import {TRPCError} from '@trpc/server';
import {getBaseUrl, invariant} from 'utils';
import {Currency} from '@prisma/client';
import {
  checkoutSessionNotFound,
  eventNotFoundError,
  stripeAccountLinkNotFound,
} from 'error';
import {isPast} from 'date-fns';

export const getCheckoutSession = protectedProcedure
  .input(
    z.object({
      checkoutSessionId: z.string().uuid(),
    })
  )
  .mutation(async ({ctx, input: {checkoutSessionId}}) => {
    const checkoutSession = await ctx.prisma.checkoutSession.findFirst({
      where: {
        id: checkoutSessionId,
      },
      include: {
        user: true,
        ticketSales: {
          include: {
            ticket: true,
            event: {
              include: {
                organization: true,
                user: true,
              },
            },
          },
        },
      },
    });

    invariant(checkoutSession, checkoutSessionNotFound);
    invariant(
      checkoutSession?.user?.id === ctx.auth?.user?.id,
      checkoutSessionNotFound
    );

    if (isPast(checkoutSession.expires)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Checkout session has expired.',
      });
    }

    const event = checkoutSession.ticketSales[0].event;

    invariant(event, eventNotFoundError);

    const stripeLinkedAccountId =
      event?.organization?.stripeLinkedAccountId ||
      event?.user?.stripeLinkedAccountId;

    invariant(stripeLinkedAccountId, stripeAccountLinkNotFound);

    const amount = checkoutSession.ticketSales.reduce((acc, ticketSale) => {
      return acc + ticketSale.quantity * ticketSale.ticket.price;
    }, 0);

    let stripeCustomer = await ctx
      .createStripeClient(stripeLinkedAccountId)
      .customers.search({
        query: `email: "${checkoutSession?.user.email}"`,
      })
      .then((res) => res.data[0]);

    if (!stripeCustomer) {
      stripeCustomer = await ctx
        .createStripeClient(stripeLinkedAccountId)
        .customers.create({
          email: checkoutSession?.user.email,
        });
    }

    const paymentIntent = await ctx.actions.createPaymentIntent({
      eventId: checkoutSession.eventId,
      stripeCustomerId: stripeCustomer.id,
      stripeLinkedAccountId,
      currency: event?.preferredCurrency || Currency.USD,
      amount,
      ticketSaleIds: checkoutSession.ticketSales.map((ts) => ts.id),
    });

    if (!paymentIntent.client_secret) {
      return null;
    }

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
      returnUrl: `${getBaseUrl()}/e/${event?.shortId}/my-tickets?success=true`,
      stripeAccountId: stripeLinkedAccountId,
      event: event,
      ticketSales: checkoutSession.ticketSales,
      expires: checkoutSession.expires,
    };
  });
