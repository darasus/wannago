import {Subscription} from '@prisma/client';
import {TRPCError} from '@trpc/server';
import {AssertionContext} from '../context';

export function assertCanAddOrganizationMember(ctx: AssertionContext) {
  return ({subscription}: {subscription: Subscription | null | undefined}) => {
    if (subscription?.type === 'BUSINESS') {
      return;
    }

    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'You need to be on a Business plan to add members.',
    });
  };
}
