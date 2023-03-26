import {router, protectedProcedure, publicProcedure} from '../trpcServer';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';
import {EmailType} from '../../../../apps/web/src/types/EmailType';
import {invariant} from 'utils';
import {
  eventNotFoundError,
  organizerNotFoundError,
  userNotFoundError,
} from 'error';

const messageEventParticipants = protectedProcedure
  .input(
    z.object({
      eventShortId: z.string(),
      subject: z.string(),
      message: z.string(),
    })
  )
  .mutation(async ({input, ctx}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.eventShortId,
      },
      include: {
        user: true,
        organization: true,
      },
    });

    invariant(event, eventNotFoundError);

    const organizer = event.user || event.organization;

    invariant(organizer, organizerNotFoundError);

    await ctx.mailQueue.publish({
      body: {
        eventId: event.id,
        subject: input.subject,
        message: input.message,
        organizerUserId: organizer.id,
      },
      type: EmailType.MessageToAllAttendees,
    });
  });

const sendQuestionToOrganizer = publicProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      subject: z.string(),
      message: z.string(),
    })
  )
  .mutation(async ({input, ctx}) => {
    const event = await ctx.prisma.event.findUnique({
      where: {
        id: input.eventId,
      },
      include: {
        user: true,
      },
    });

    invariant(event, eventNotFoundError);
    invariant(event.user, userNotFoundError);

    await ctx.mailQueue.publish({
      body: {
        eventId: event.id,
        organizerName: `${input.firstName} ${input.lastName}`,
        organizerEmail: event.user?.email,
        email: input.email,
        message: input.message,
        subject: input.subject,
      },
      type: EmailType.MessageToOrganizer,
    });

    return {status: 'ok'};
  });

export const mailRouter = router({
  sendQuestionToOrganizer,
  messageEventParticipants,
});
