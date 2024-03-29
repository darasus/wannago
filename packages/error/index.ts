import {TRPCError} from '@trpc/server';

export const userNotFoundError = new TRPCError({
  code: 'NOT_FOUND',
  message: 'User not found',
});

export const organizerNotFoundError = new TRPCError({
  code: 'NOT_FOUND',
  message: 'Organizer not found',
});

export const eventNotFoundError = new TRPCError({
  code: 'NOT_FOUND',
  message: 'Event not found',
});

export const conversationNotFoundError = new TRPCError({
  code: 'NOT_FOUND',
  message: 'Conversation not found',
});

export const forbiddenError = new TRPCError({
  code: 'FORBIDDEN',
  message: 'Not allowed to perform this action',
});

export const checkoutSessionNotFound = new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Checkout session not found',
});
