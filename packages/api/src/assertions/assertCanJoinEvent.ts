import {Event, Organization, Subscription, User} from '@prisma/client';
import {TRPCError} from '@trpc/server';
import {getFeatures, isOrganization, isUser} from 'utils';
import {AssertionContext} from '../context';

export function assertCanJoinEvent(ctx: AssertionContext) {
  return ({
    event,
    organizer,
    numberOfInvitedUsers,
    numberOfRegisteredUsers,
    subscription,
  }: {
    organizer: User | Organization | null | undefined;
    subscription: Subscription | null | undefined;
    numberOfInvitedUsers: number | null | undefined;
    numberOfRegisteredUsers: number | null | undefined;
    event: Event;
  }) => {
    const features = getFeatures({
      subscriptionType: subscription?.type || 'STARTER',
    });

    const isBusiness = subscription?.type === 'BUSINESS';
    const isPro = subscription?.type === 'PRO';
    const hasReachedNumberOfInvitedUsers =
      typeof numberOfInvitedUsers === 'number' &&
      numberOfInvitedUsers >= features.maxNumberOfPersonalEventAttendees;

    if (isOrganization(organizer) && !isBusiness) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `You can't join events as organization without Business plan`,
      });
    }

    const isRequestedByAdmin =
      isUser(organizer) &&
      ctx.auth?.userId &&
      organizer.externalId === ctx.auth?.userId;

    if (isUser(organizer) && !isPro && hasReachedNumberOfInvitedUsers) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: isRequestedByAdmin
          ? `You have reached the limit of ${features.maxNumberOfPersonalEventAttendees} attendees on Starter plan.`
          : 'Event has reached maximum number of attendees.',
      });
    }

    const hasReachedNumberOfRegisteredUsers =
      typeof numberOfRegisteredUsers === 'number' &&
      numberOfRegisteredUsers >= event?.maxNumberOfAttendees &&
      event?.maxNumberOfAttendees !== 0;

    if (hasReachedNumberOfRegisteredUsers) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event is full and no longer accepts sign ups.',
      });
    }
  };
}
