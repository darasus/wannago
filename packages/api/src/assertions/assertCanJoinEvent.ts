import {Event} from '@prisma/client';
import {TRPCError} from '@trpc/server';
import {AssertionContext} from '../context';

export function assertCanJoinEvent(ctx: AssertionContext) {
  return ({
    event,
    numberOfRegisteredUsers,
    code,
  }: {
    numberOfRegisteredUsers: number | null | undefined;
    event: Event;
    code?: string;
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

    if (event.signUpProtection === 'PROTECTED') {
      if (!code) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Code is required for protected events.',
        });
      }

      if (event.signUpProtectionCode !== code) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Provided code is not valid.',
        });
      }
    }
  };
}
