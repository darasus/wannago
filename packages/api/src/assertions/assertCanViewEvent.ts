import {Event, Organization, User} from '@prisma/client';
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
  return async ({
    event,
    code,
  }: {
    event: Event & {
      user: User | null;
      organization: (Organization & {users: User[]}) | null;
    };
    code?: string;
  }) => {
    if (ctx.auth?.user.type === 'ADMIN') {
      return;
    }

    const isMyEvent = getIsMyEvent(event, ctx);

    if (isMyEvent) {
      return;
    }

    if (!event.isPublished) {
      throw new ViewEventError({
        code: 'NOT_FOUND',
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
      throw new ViewEventError({
        code: 'FORBIDDEN',
        message: 'Provided code is not valid.',
      });
    }
  };
}

function getIsMyEvent(
  event: Event & {
    user: User | null;
    organization: (Organization & {users: User[]}) | null;
  },
  ctx: AssertionContext
) {
  if (event.user?.id === ctx.auth?.user.id) {
    return true;
  }

  if (event.organization?.users.some((u) => u.id === ctx.auth?.user.id)) {
    return true;
  }

  return false;
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
