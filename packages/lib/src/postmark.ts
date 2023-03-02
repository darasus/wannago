import {captureException} from '@sentry/nextjs';
import {env} from 'server-env';
import {z} from 'zod';

const scheme = z.object({
  to: z.string().email(),
  replyTo: z.string().email().optional(),
  subject: z.string(),
  htmlString: z.string(),
});

type Input = z.input<typeof scheme>;

type MessageStream =
  | 'outbound'
  | 'broadcast'
  | 'organizer-event-sign-up-notifi';

export class Postmark {
  private client({
    to,
    replyTo,
    subject,
    htmlString,
    messageStream,
  }: Input & {messageStream: MessageStream}) {
    return fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': env.POSTMARK_API_KEY,
      },
      body: JSON.stringify({
        From: 'hi@wannago.app',
        To: to,
        ReplyTo: replyTo || to,
        Subject: subject,
        HtmlBody: htmlString,
        MessageStream: messageStream,
      }),
    }).catch(error => {
      captureException(error);
    });
  }

  sendToTransactionalStream({to, subject, htmlString, replyTo}: Input) {
    return this.client({
      to,
      subject,
      htmlString,
      replyTo,
      messageStream: 'outbound',
    });
  }

  sendToBroadcastStream({to, subject, htmlString, replyTo}: Input) {
    return this.client({
      to,
      subject,
      htmlString,
      replyTo,
      messageStream: 'broadcast',
    });
  }

  sendToOrganizerEventSignUpNotificationStream({
    to,
    subject,
    htmlString,
    replyTo,
  }: Input) {
    return this.client({
      to,
      subject,
      htmlString,
      replyTo,
      messageStream: 'organizer-event-sign-up-notifi',
    });
  }
}
