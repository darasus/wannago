import {z} from 'zod';
import {Listing, Prisma} from '@prisma/client';
import {ActionContext} from '../context';

const validation = z.object({
  isPublished: z.boolean().optional(),
  onlyPast: z.boolean().optional(),
  orderByStartDate: z.enum(['desc', 'asc']).optional(),
  listing: z.nativeEnum(Listing).optional(),
});

export function getEvents(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {isPublished, listing} = validation.parse(input);

    const organizingQuery: Prisma.EventWhereInput['OR'] = [
      {
        isPublished,
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
      },
      include: {
        tickets: true,
      },
    });

    return events;
  };
}
