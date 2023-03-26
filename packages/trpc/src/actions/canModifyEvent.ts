import {TRPCError} from '@trpc/server';
import {forbiddenError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  eventId: z.string(),
});

export function canModifyEvent(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {eventId} = validation.parse(input);

    const [event, user] = await Promise.all([
      ctx.prisma.event.findFirst({
        where: {
          id: eventId,
        },
        include: {
          organization: true,
          user: true,
        },
      }),
      ctx.prisma.user.findFirst({
        where: {
          externalId: ctx.auth?.userId,
        },
        include: {
          organization: true,
        },
      }),
    ]);

    const userId = user?.id;
    const eventUserId = event?.user?.id;

    const organizationId = user?.organization?.id;
    const eventOrganizationId = event?.organization?.id;

    invariant(userId || organizationId, forbiddenError);

    const isMyEvent =
      userId === eventUserId || organizationId === eventOrganizationId;

    invariant(isMyEvent, forbiddenError);
  };
}
