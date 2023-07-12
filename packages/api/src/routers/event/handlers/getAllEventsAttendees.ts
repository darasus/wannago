import {EventRegistrationStatus, User} from '@prisma/client';
import {TRPCError} from '@trpc/server';
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

    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth.userId,
      },
      include: {
        organizations: true,
      },
    });

    invariant(
      user,
      new TRPCError({code: 'NOT_FOUND', message: 'User not found'})
    );

    const eventSignUps = await ctx.prisma.eventSignUp.findMany({
      where: {
        OR: [
          {
            event: {
              userId: user.id,
            },
          },
          ...user.organizations.map((organization) => ({
            event: {
              organizationId: organization.id,
            },
          })),
        ],
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
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
