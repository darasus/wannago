import {createTRPCRouter, protectedProcedure} from '../trpc';
import {z} from 'zod';
import {EmailType} from 'types';
import {invariant} from 'utils';
import {eventNotFoundError, organizerNotFoundError} from 'error';
import {handleMessageToAllAttendeesEmailInputSchema} from 'email-input-validation';

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

export const mailRouter = createTRPCRouter({
  messageEventParticipants,
});
