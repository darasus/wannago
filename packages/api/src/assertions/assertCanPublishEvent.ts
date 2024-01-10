import {env} from '../../../env/server';
import {AssertionContext} from '../context';
import {invariant} from 'utils';

export function assertCanPublishEvent(ctx: AssertionContext) {
  return async ({eventId}: {eventId: string}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        id: eventId,
      },
      include: {
        tickets: true,
      },
    });

    if (event?.tickets && event.tickets?.length > 0) {
      invariant(
        env.STRIPE_API_SECRET || env.STRIPE_ENDPOINT_SECRET,
        'Missing Stripe API keys'
      );
    }
  };
}
