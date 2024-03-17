import {Listing} from '@prisma/client';
import {z} from 'zod';

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

    const events = await ctx.prisma.event.findMany({
      orderBy: {
        startDate:
          input.orderByStartDate ?? input.onlyPast === true ? 'desc' : 'asc',
      },
      where: {
        isPublished: isPublished ?? true,
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
