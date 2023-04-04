import {Event, Organization, Subscription, User} from '@prisma/client';
import {TRPCError} from '@trpc/server';
import {getFeatures} from 'utils';
import {AssertionContext} from '../context';

export function assertCanCreateEvent(ctx: AssertionContext) {
  return ({
    user,
    userEventCount,
    organization,
    subscription,
  }: {
    organization: Organization | null | undefined;
    user: User | null | undefined;
    subscription: Subscription | null | undefined;
    userEventCount: number | null | undefined;
  }) => {
    const features = getFeatures({
      subscriptionType: subscription?.type || 'STARTER',
    });

    if (organization && subscription?.type !== 'BUSINESS') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'You need to subscribe to Business plan to create events as organization',
      });
    }

    console.log(
      user &&
        typeof userEventCount === 'number' &&
        userEventCount > features.maxNumberOfPersonalEvents &&
        subscription?.type !== 'PRO'
    );

    if (
      user &&
      typeof userEventCount === 'number' &&
      userEventCount >= features.maxNumberOfPersonalEvents &&
      subscription?.type !== 'PRO'
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'You need to subscribe to Pro plan to create more than 5 events',
      });
    }
  };
}
