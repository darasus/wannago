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

    const event = await ctx.prisma.event.findFirst({
      where: {
        id: eventId,
        OR: [
          {
            user: {
              externalId: ctx.auth?.userId,
            },
          },
          {
            organization: {
              users: {
                some: {
                  externalId: ctx.auth?.userId,
                },
              },
            },
          },
        ],
      },
    });

    invariant(ctx.auth?.userId && event, forbiddenError);

    return true;
  };
}
