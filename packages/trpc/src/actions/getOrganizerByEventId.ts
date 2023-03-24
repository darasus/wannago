import {Organization, User} from '@prisma/client';
import {TRPCError} from '@trpc/server';
import {omit} from 'ramda';
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

    if (!event) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Event not found',
      });
    }

    if (event.user) {
      return event.user;
    }

    return event.organization;
  };
}
