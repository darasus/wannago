import {router, protectedProcedure} from '../trpc';
import {z} from 'zod';

export const emailRouter = router({
  sendEventRegistrationEmail: protectedProcedure
    .input(
      z.object({
        eventId: z.string().uuid(),
      })
    )
    .mutation(async ({input, ctx}) => {
      const messageData = {
        from: 'WannaGo Team <hi@wannago.app>',
        to: 'idarase@gmail.com',
        subject: 'Hello',
        html: '<div style="color:pink;">HTML version of the body</div>',
      };

      ctx.mailgun.messages
        .create('email.wannago.app', messageData)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });

      return {status: 'ok'};
    }),
});
