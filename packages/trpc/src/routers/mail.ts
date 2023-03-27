import {router, protectedProcedure, publicProcedure} from '../trpcServer';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';
import {EmailType} from 'types';
import {invariant} from 'utils';
import {eventNotFoundError, organizerNotFoundError} from 'error';
import {
  handleMessageToAllAttendeesEmailInputSchema,
  handleMessageToOrganizerEmailInputSchema,
} from 'email-input-validation';

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

    await ctx.mailQueue.addMessage({
      body: {
        eventId: event.id,
        subject: input.subject,
        message: input.message,
        organizerId: organizer.id,
        type: EmailType.MessageToAllAttendees,
      } satisfies z.infer<typeof handleMessageToAllAttendeesEmailInputSchema>,
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
    const organizer = await ctx.actions.getOrganizerByEventId({
      id: input.eventId,
    });

    invariant(organizer, organizerNotFoundError);

    const event = await ctx.prisma.event.findUnique({
      where: {
        id: input.eventId,
      },
      include: {
        user: true,
      },
    });

    invariant(event, eventNotFoundError);
    invariant(
      organizer.email,
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Organizer has no email',
      })
    );

    await ctx.mailQueue.addMessage({
      body: {
        eventId: event.id,
        senderName: `${input.firstName} ${input.lastName}`,
        organizerEmail: organizer.email,
        email: input.email,
        message: input.message,
        subject: input.subject,
        type: EmailType.MessageToOrganizer,
      } satisfies z.infer<typeof handleMessageToOrganizerEmailInputSchema>,
    });

    return {status: 'ok'};
  });

export const mailRouter = router({
  sendQuestionToOrganizer,
  messageEventParticipants,
});
