import {TRPCError} from '@trpc/server';

export const userNotFoundError = new TRPCError({
  code: 'NOT_FOUND',
  message: 'User not found',
});

export const organizationNotFoundError = new TRPCError({
  code: 'NOT_FOUND',
  message: 'Organization not found',
});

export const organizerNotFoundError = new TRPCError({
  code: 'NOT_FOUND',
  message: 'Organizer not found',
});

export const eventNotFoundError = new TRPCError({
  code: 'NOT_FOUND',
  message: 'Event not found',
});
