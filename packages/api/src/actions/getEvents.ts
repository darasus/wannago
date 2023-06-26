import {z} from 'zod';
import {Prisma} from '@prisma/client';
import {ActionContext} from '../context';

const validation = z.object({
  authorIds: z.array(z.string().uuid()),
  eventType: z.enum(['attending', 'organizing', 'all', 'following']),
  isPublished: z.boolean().optional(),
  onlyPast: z.boolean().optional(),
});

export function getEvents(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {authorIds, isPublished, eventType} = validation.parse(input);

    const organizingQuery: Prisma.EventWhereInput['OR'] = [
      {
        isPublished,
        user: {
          id: {
            in: authorIds,
          },
        },
      },
      {
        organization: {
          id: {
            in: authorIds,
          },
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
              id: {
                in: authorIds,
              },
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
              followerUserId: {
                in: authorIds,
              },
            },
          },
        },
      },
      {
        isPublished: true,
        organization: {
          followers: {
            some: {
              followerUserId: {
                in: authorIds,
              },
            },
          },
        },
      },
    ];
    const events = await ctx.prisma.event.findMany({
      orderBy: {
        startDate: 'asc',
      },
      where: {
        ...(input.onlyPast === true
          ? {
              endDate: {
                lte: new Date(),
              },
            }
          : {}),
        ...(input.onlyPast === false
          ? {
              endDate: {
                gte: new Date(),
              },
            }
          : {}),
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
