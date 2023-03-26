import {TRPCClientError} from '@trpc/client';
import {AnyRouter, TRPCError} from '@trpc/server';

export function invariant<T>(
  input: T | null | undefined,
  error?: TRPCClientError<AnyRouter> | TRPCError | string
): asserts input is NonNullable<T> {
  if (input === null || typeof input === 'undefined' || input === false) {
    if (error) {
      throw error;
    }

    throw new Error('Invariant violation');
  }
}
