import {eventNotFoundError, userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {publicProcedure} from '../../../trpc';

export const getMyTicketsByEvent = publicProcedure
  .input(
    z.object({
      eventShortId: z.string(),
    })
  )
  .query(async ({ctx, input}) => {
    if (!ctx.auth?.user?.id) {
      return null;
    }

    const user = await ctx.actions.getUserById({
      id: ctx.auth?.user?.id,
    });

    const event = await ctx.prisma.event.findUnique({
      where: {
        shortId: input.eventShortId,
      },
    });

    invariant(user, userNotFoundError);
    invariant(event, eventNotFoundError);

    return ctx.prisma.eventSignUp.findMany({
      where: {
        eventId: event.id,
        userId: user.id,
      },
      include: {
        event: true,
        ticketSales: {
          include: {
            ticket: true,
          },
        },
      },
    });
  });
