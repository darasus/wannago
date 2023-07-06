import {captureException} from '@sentry/nextjs';
import {env} from 'server-env';
import {z} from 'zod';

const scheme = z.object({
  to: z.string().email(),
  from: z.string().email().optional(),
  replyTo: z.string().email().optional(),
  subject: z.string(),
  htmlString: z.string(),
});

type Input = z.input<typeof scheme>;

type MessageStream =
  | 'outbound'
  | 'broadcast'
  | 'invite-to-wannago-emails'
  | 'organizer-event-sign-up-notifi';

export class Postmark {
  private client({
    from,
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
        From: from || 'hello@wannago.app',
        To: to,
        ReplyTo: replyTo || to,
        Subject: subject,
        HtmlBody: htmlString,
        MessageStream: messageStream,
      }),
    }).catch((error) => {
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

  inviteToWannaGoBroadcastChannel({
    to,
    subject,
    htmlString,
    replyTo,
    from,
  }: Input) {
    return this.client({
      to,
      subject,
      htmlString,
      replyTo,
      from,
      messageStream: 'invite-to-wannago-emails',
    });
  }
}
