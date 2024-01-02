import {z} from 'zod';
import {Listing, Prisma} from '@prisma/client';
import {ActionContext} from '../context';

const validation = z.object({
  authorIds: z.array(z.string().uuid()),
  eventType: z.enum(['attending', 'organizing', 'all']),
  isPublished: z.boolean().optional(),
  onlyPast: z.boolean().optional(),
  orderByStartDate: z.enum(['desc', 'asc']).optional(),
  listing: z.nativeEnum(Listing).optional(),
});

export function getEvents(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {authorIds, isPublished, eventType, listing} =
      validation.parse(input);

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
    const events = await ctx.prisma.event.findMany({
      orderBy: {
        startDate:
          input.orderByStartDate ?? input.onlyPast === true ? 'desc' : 'asc',
      },
      where: {
        ...(listing ? {listing} : {}),
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
          ...(eventType === 'all'
            ? [...organizingQuery, ...attendingQuery]
            : []),
        ],
      },
      include: {
        user: true,
        organization: true,
        tickets: true,
      },
    });

    return events;
  };
}
