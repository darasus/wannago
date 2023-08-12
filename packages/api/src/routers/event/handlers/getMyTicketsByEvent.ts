import {eventNotFoundError, userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {publicProcedure} from '../../../trpc';
import {getUserByExternalId} from '../../../actions/getUserByExternalId';

export const getMyTicketsByEvent = publicProcedure
  .input(
    z.object({
      eventShortId: z.string(),
    })
  )
  .query(async ({ctx, input}) => {
    if (!ctx.auth?.userId) {
      return null;
    }

    const user = await getUserByExternalId(ctx)({
      externalId: ctx.auth.user?.id,
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
