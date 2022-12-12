import {router, protectedProcedure} from '../trpc';
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
    const users = await ctx.prisma.user.findMany({
      where: {
        attendingEvents: {
          some: {
            id: input.eventId,
          },
        },
      },
    });

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

    console.log('hello');

    await ctx.mail.sendMessageToEventParticipants({
      event,
      users,
      subject: input.subject,
      message: input.message,
      organizerUser,
    });
  });

export const mailRouter = router({
  sendQuestionToOrganizer: protectedProcedure
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
      });

      if (!event) {
        throw new Error('Event not found!');
      }

      await ctx.mail.sendQuestionToOrganizer({
        event,
        organizerEmail: ctx.user.emailAddresses[0].emailAddress,
        ...input,
      });

      return {status: 'ok'};
    }),
  messageEventParticipants,
});
