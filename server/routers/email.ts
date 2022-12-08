import {router, protectedProcedure} from '../trpc';
import {z} from 'zod';
import {getBaseUrl} from '../../utils/getBaseUrl';

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

      const eventUrl = `${getBaseUrl()}/e/${event?.shortId}`;

      const messageData = {
        from: `${input.firstName} ${input.lastName} <${input.email}>`,
        to: ctx.user.emailAddresses[0].emailAddress,
        subject: 'Someone asked you a question on WannaGo',
        html: `
          <div>
            <div>Event: <a href="${eventUrl}" target="_blank">${event?.title}</a></div>
            <div>Email: ${input.email}</div>
            <div>Name: ${input.firstName} ${input.lastName}</div>
            <div>Subject: ${input.subject}</div>
            <div>Message: ${input.message}</div>
          </div>
        `,
      };

      ctx.mailgun.messages.create('email.wannago.app', messageData);

      return {status: 'ok'};
    }),
});
