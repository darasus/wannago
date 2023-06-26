import {TRPCError} from '@trpc/server';
import {eventNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  id: z.string(),
  isPublished: z.boolean().optional(),
});

export function getOrganizerByEventId(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {id, isPublished} = validation.parse(input);

    const event = await ctx.prisma.event.findFirst({
      where: {
        OR: [{id}, {shortId: id}],
        isPublished,
      },
      include: {
        user: true,
        organization: true,
      },
    });

    invariant(event, eventNotFoundError);

    return event.user || event.organization;
  };
}
