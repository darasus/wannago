import {slugify} from 'inngest';
import {inngest} from '../client';
import {addDays} from 'date-fns';

export const stripePayoutScheduled = inngest.createFunction(
  {
    id: slugify('Stripe Payout Scheduled'),
    name: 'Stripe Payout Scheduled',
    cancelOn: [
      {event: 'event.removed', match: 'data.eventId'},
      {event: 'event.unpublished', match: 'data.eventId'},
      {event: 'event.updated', match: 'data.eventId'},
    ],
  },
  {event: 'stripe/payout.scheduled'},
  async (ctx) => {
    const event = await ctx.step.run('Fetch event', () =>
      ctx.prisma.event.findUnique({
        where: {id: ctx.event.data.eventId},
        include: {user: true, organization: true},
      })
    );

    if (!event?.endDate) {
      return null;
    }

    const endDate = new Date(event.endDate);
    const payoutDate = addDays(endDate, 7); // 7 days after event

    await ctx.step.sleepUntil('wait-before-payout', payoutDate);

    await ctx.step.run('Payout to linked account', async () => {
      const stripeLinkedAccountId =
        event.organization?.stripeLinkedAccountId ||
        event.user?.stripeLinkedAccountId;

      if (!stripeLinkedAccountId) {
        return null;
      }

      await ctx.actions.payoutAvailableBalanceToConnectedAccount({
        stripeLinkedAccountId,
      });
    });
  }
);

export const stripeTicketsPurchaseIntentCreated = inngest.createFunction(
  {
    id: slugify('Stripe Ticket Purchase Intent Created'),
    name: 'Stripe Ticket Purchase Intent Created',
  },
  {event: 'stripe/ticket.purchase-intent.created'},
  async (ctx) => {
    await ctx.step.sleep('wait-a-second', 1000);

    const checkoutSession = await ctx.step.run(
      'Fetch checkout session',
      async () => {
        return ctx.prisma.checkoutSession.findUnique({
          where: {
            id: ctx.event.data.checkoutSessionId,
          },
        });
      }
    );

    if (!checkoutSession?.expires) {
      return null;
    }

    await ctx.step.sleepUntil(
      'wait-checkout-session-expiration',
      checkoutSession?.expires
    );

    const freshCheckoutSession = await ctx.step.run(
      'Fetch fresh checkout session',
      async () => {
        return ctx.prisma.checkoutSession.findUnique({
          where: {
            id: ctx.event.data.checkoutSessionId,
          },
          include: {
            ticketSales: true,
          },
        });
      }
    );

    if (!freshCheckoutSession) {
      return null;
    }

    for (const ticketSale of freshCheckoutSession.ticketSales) {
      if (ticketSale.status === 'PENDING') {
        await ctx.step.run('Delete ticket sale', async () => {
          await ctx.prisma.ticketSale.update({
            where: {id: ticketSale.id},
            data: {status: 'EXPIRED'},
          });
        });
      }
    }
  }
);

export const stripeTicketsPurchased = inngest.createFunction(
  {
    id: slugify('Stripe Tickets Purchased'),
    name: 'Stripe Tickets Purchased',
  },
  {event: 'stripe/tickets.purchased'},
  async (ctx) => {
    await ctx.step.sleep('wait-a-second', 1000);
    await ctx.step.sendEvent('send-ticket-purchase-email', {
      name: 'email/ticket-purchase-email.sent',
      data: {
        eventId: ctx.event.data.eventId,
        userId: ctx.event.data.userId,
        ticketSaleIds: ctx.event.data.ticketSaleIds,
      },
    });
  }
);
