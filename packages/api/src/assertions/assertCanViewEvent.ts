import {Event} from '@prisma/client';
import {AssertionContext} from '../context';
import {TRPCError} from '@trpc/server';
import {TRPC_ERROR_CODE_KEY} from '@trpc/server/rpc';

class ViewEventError extends TRPCError {
  name: string = 'ViewEventError';

  constructor(opts: {
    message?: string;
    code: TRPC_ERROR_CODE_KEY;
    cause?: unknown;
  }) {
    super(opts);
  }
}

export function assertCanViewEvent(ctx: AssertionContext) {
  return ({event, code}: {event: Event; code?: string}) => {
    if (event.eventVisibility === 'PROTECTED') {
      if (!code) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Code is required for protected events.',
        });
      }

      if (
        event.eventVisibilityCode?.toLocaleLowerCase() !==
        code.toLocaleLowerCase()
      ) {
        throw new ViewEventError({
          code: 'FORBIDDEN',
          message: 'Provided code is not valid.',
        });
      }
    }
  };
}
