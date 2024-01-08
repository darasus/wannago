import {z} from 'zod';
import {publicProcedure} from '../../../trpc';
import {invariant, isPast} from 'utils';
import {eventNotFoundError} from 'error';
import {UserType} from '@prisma/client';

export const getByShortId = publicProcedure
  .input(
    z.object({
      id: z.string().min(1),
      code: z.string().optional(),
    })
  )
  .query(async ({input, ctx}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.id,
      },
      include: {
        tickets: {
          orderBy: {
            price: 'asc',
          },
        },
      },
    });

    invariant(event, eventNotFoundError);

    await ctx.assertions.assertCanViewEvent({event, code: input.code});

    return {
      ...event,
      isPast: isPast(event.endDate, ctx.timezone),
      isMyEvent: ctx.auth?.user.type === UserType.ADMIN,
    };
  });
