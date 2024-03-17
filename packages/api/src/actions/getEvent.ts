import {z} from 'zod';

import {ActionContext} from '../context';

const validation = z.object({
  id: z.string(),
  isPublished: z.boolean().optional(),
});

export function getEvent(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {id, isPublished} = validation.parse(input);

    const events = await ctx.prisma.event.findFirst({
      where: {
        isPublished,
        OR: [{id}, {shortId: id}],
      },
    });

    return events;
  };
}
