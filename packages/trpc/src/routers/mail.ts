import {router, protectedProcedure, publicProcedure} from '../trpcServer';
import {z} from 'zod';

const messageEventParticipants = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
      subject: z.string(),
      message: z.string(),
    })
  )
  .mutation(async ({input, ctx}) => {
    const event = await ctx.prisma.event.findUnique({
      where: {
        id: input.eventId,
      },
    });

    const organizerUser = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.user.id,
      },
    });

    if (!event) {
      throw new Error('Event not found!');
    }

    if (!organizerUser) {
      throw new Error('Organizer not found!');
    }

    await ctx.mailQueue.enqueueMessageToAllAttendeesEmail({
      eventId: input.eventId,
      subject: input.subject,
      message: input.message,
      organizerUserId: organizerUser.id,
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
        organization: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found!');
    }

    for (const user of event.organization?.users || []) {
      await ctx.mailQueue.enqueueMessageToOrganizerEmail({
        eventId: event.id,
        organizerEmail: user.email,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        message: input.message,
        subject: input.subject,
      });
    }

    return {status: 'ok'};
  });

export const mailRouter = router({
  sendQuestionToOrganizer,
  messageEventParticipants,
});
