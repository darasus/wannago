import {Event} from '@prisma/client';
import {TRPCError} from '@trpc/server';
import {AssertionContext} from '../context';

export function assertCanJoinEvent(ctx: AssertionContext) {
  return ({
    event,
    numberOfRegisteredUsers,
  }: {
    numberOfRegisteredUsers: number | null | undefined;
    event: Event;
  }) => {
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
