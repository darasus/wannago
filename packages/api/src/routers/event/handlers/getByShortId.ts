import {z} from 'zod';
import {publicProcedure} from '../../../trpc';
import {invariant, isPast} from 'utils';
import {eventNotFoundError} from 'error';
import {assertCanViewEvent} from '../../../assertions/assertCanViewEvent';

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
        organization: {
          include: {
            users: true,
          },
        },
        user: true,
        tickets: {
          orderBy: {
            price: 'asc',
          },
        },
      },
    });

    invariant(event, eventNotFoundError);

    await assertCanViewEvent(ctx)({event, code: input.code});

    return {
      ...event,
      isPast: isPast(event.endDate, ctx.timezone),
      isMyEvent:
        event.userId === ctx.auth?.user.id ||
        event.organization?.users.some((u) => u.id === ctx.auth?.user.id) ||
        false,
    };
  });
