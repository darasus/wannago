import {EventRegistrationStatus, User} from '@prisma/client';
import {eventNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

export const getAllEventsAttendees = protectedProcedure
  .input(
    z.object({
      eventShortId: z.string(),
    })
  )
  .query(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.eventShortId,
      },
    });

    invariant(event, eventNotFoundError);

    const eventSignUps = await ctx.prisma.eventSignUp.findMany({
      where: {
        userId: ctx.auth?.user?.id,
      },
      include: {
        user: true,
      },
    });

    const userMap: Record<
      string,
      User & {status: EventRegistrationStatus | null}
    > = {};

    for (const eventSignUp of eventSignUps) {
      if (!userMap[eventSignUp.userId]) {
        userMap[eventSignUp.userId] = {
          ...eventSignUp.user,
          status: null,
        };
      }

      if (eventSignUp.eventId === event.id) {
        userMap[eventSignUp.userId].status = eventSignUp.status;
      }
    }

    return Object.values(userMap);
  });
