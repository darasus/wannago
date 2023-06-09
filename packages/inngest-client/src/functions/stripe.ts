import {inngest} from '../client';
import {addDays} from 'date-fns';

export const stripePayoutScheduled = inngest.createFunction(
  {
    name: 'Stripe Payout Scheduled',
    cancelOn: [
      {event: 'event.removed', match: 'data.eventId'},
      {event: 'event.unpublished', match: 'data.eventId'},
      {event: 'event.updated', match: 'data.eventId'},
    ],
  },
  {event: 'stripe/payout.scheduled'},
  async ctx => {
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

    await ctx.step.sleepUntil(payoutDate);

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
