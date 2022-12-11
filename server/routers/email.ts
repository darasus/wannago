import {router, protectedProcedure} from '../trpc';
import {z} from 'zod';

export const emailRouter = router({
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
});
