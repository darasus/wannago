import {AssertionContext} from '../context';
import {invariant} from 'utils';
import {stripeAccountLinkNotFound} from 'error';

export function assertCanPublishEvent(ctx: AssertionContext) {
  return async ({eventId}: {eventId: string}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        id: eventId,
      },
      include: {
        organization: true,
        user: true,
        tickets: true,
      },
    });

    if (event?.tickets && event.tickets?.length > 0) {
      if (event.organization) {
        invariant(
          event.organization.stripeLinkedAccountId,
          stripeAccountLinkNotFound
        );
      }
      if (event.user) {
        invariant(event.user.stripeLinkedAccountId, stripeAccountLinkNotFound);
      }
    }
  };
}
