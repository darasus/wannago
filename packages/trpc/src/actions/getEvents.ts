import {z} from 'zod';
import {Prisma} from '@prisma/client';
import {ActionContext} from '../context';

const validation = z.object({
  id: z.string().uuid(),
  isPublished: z.boolean().optional(),
  eventType: z.enum(['attending', 'organizing', 'all', 'following']),
});

export function getEvents(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {id, isPublished, eventType} = validation.parse(input);

    const organizingQuery: Prisma.EventWhereInput['OR'] = [
      {
        isPublished,
        user: {
          id,
        },
      },
      {
        organization: {
          id,
        },
      },
    ];
    const attendingQuery: Prisma.EventWhereInput['OR'] = [
      {
        isPublished: true,
        eventSignUps: {
          some: {
            status: {
              in: ['REGISTERED', 'INVITED'],
            },
            user: {
              id,
            },
          },
        },
      },
    ];
    const followingQuery: Prisma.EventWhereInput['OR'] = [
      {
        isPublished: true,
        user: {
          followers: {
            some: {
              followerUserId: id,
            },
          },
        },
      },
      {
        isPublished: true,
        organization: {
          followers: {
            some: {
              followerUserId: id,
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
        OR: [
          ...(eventType === 'organizing' ? organizingQuery : []),
          ...(eventType === 'attending' ? attendingQuery : []),
          ...(eventType === 'following' ? followingQuery : []),
          ...(eventType === 'all'
            ? [...organizingQuery, ...attendingQuery, ...followingQuery]
            : []),
        ],
      },
      include: {
        user: true,
        organization: true,
      },
    });

    return events;
  };
}
