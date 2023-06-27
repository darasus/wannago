import {createTRPCRouter, protectedProcedure} from '../trpc';
import {z} from 'zod';
import {invariant} from 'utils';
import {eventNotFoundError, organizerNotFoundError} from 'error';

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

    await ctx.inngest.send({
      name: 'email/message.to.all.attendees',
      data: {
        eventId: event.id,
        subject: input.subject,
        message: input.message,
        organizerId: organizer.id,
      },
    });
  });

export const mailRouter = createTRPCRouter({
  messageEventParticipants,
});
