import {router, protectedProcedure, publicProcedure} from '../trpcServer';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';

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
    });

    const organizerUser = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth.userId,
      },
    });

    if (!event) {
      throw new Error('Event not found!');
    }

    if (!organizerUser) {
      throw new Error('Organizer not found!');
    }

    await ctx.mailQueue.enqueueMessageToAllAttendeesEmail({
      eventId: event.id,
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
        user: true,
      },
    });

    if (!event || !event.user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Event or user not found',
      });
    }

    await ctx.mailQueue.enqueueMessageToOrganizerEmail({
      eventId: event.id,
      organizerEmail: event.user?.email,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      message: input.message,
      subject: input.subject,
    });

    return {status: 'ok'};
  });

export const mailRouter = router({
  sendQuestionToOrganizer,
  messageEventParticipants,
});
