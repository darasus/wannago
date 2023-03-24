import {z} from 'zod';
import {Prisma} from '@prisma/client';
import {ActionContext} from '../context';

const validation = z.object({
  id: z.string().uuid(),
  isPublished: z.boolean().optional(),
  eventType: z.enum(['attending', 'organizing', 'all']),
});

export function getEvents(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {id, isPublished, eventType} = validation.parse(input);

    const organizingQuery: Prisma.EventWhereInput['OR'] = [
      {
        user: {
          id,
        },
      },
      {
        organization: {
          disabled: false,
          id,
        },
      },
      {
        organization: {
          disabled: false,
          isActive: {
            not: true,
          },
          users: {
            some: {
              id,
            },
          },
        },
      },
    ];
    const attendingQuery: Prisma.EventWhereInput['OR'] = [
      {
        eventSignUps: {
          some: {
            user: {
              id,
            },
          },
        },
      },
    ];
    const events = await ctx.prisma.event.findMany({
      orderBy: {
        startDate: 'desc',
      },
      where: {
        isPublished,
        OR: [
          ...(eventType === 'organizing' ? organizingQuery : []),
          ...(eventType === 'attending' ? attendingQuery : []),
          ...(eventType === 'all'
            ? [...organizingQuery, ...attendingQuery]
            : []),
        ],
      },
    });

    return events;
  };
}
