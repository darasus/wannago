import {Event} from '@prisma/client';
import {AssertionContext} from '../context';
import {TRPCError} from '@trpc/server';

export function assertCanViewEvent(ctx: AssertionContext) {
  return async ({event, code}: {event: Event; code?: string}) => {
    if (ctx.auth?.user.type === 'ADMIN') {
      return;
    }

    if (!event.isPublished) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Event is not published.',
      });
    }

    if (await amILinkedToEvent(event.id, ctx)) {
      return;
    }

    if (event.eventVisibility === 'PROTECTED' && !code) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Code is required for protected events.',
      });
    }

    if (
      code &&
      event.eventVisibilityCode?.toLocaleLowerCase() !==
        code.toLocaleLowerCase()
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Provided code is not valid.',
      });
    }
  };
}

async function amILinkedToEvent(eventId: string, ctx: AssertionContext) {
  if (!ctx.auth?.user.id) {
    return false;
  }

  const result = await ctx.prisma.event.findUnique({
    where: {
      id: eventId,
      eventSignUps: {
        some: {
          userId: ctx.auth?.user.id,
          status: {
            in: ['INVITED', 'REGISTERED'],
          },
        },
      },
    },
  });

  return Boolean(result);
}
