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

export class Postmark {
  private client({
    to,
    replyTo,
    subject,
    htmlString,
    messageStream,
  }: Input & {messageStream: 'outbound' | 'broadcasts'}) {
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

  sendTransactionalEmail({to, subject, htmlString, replyTo}: Input) {
    return this.client({
      to,
      subject,
      htmlString,
      replyTo,
      messageStream: 'outbound',
    });
  }

  sendBroadcastEmail({to, subject, htmlString, replyTo}: Input) {
    return this.client({
      to,
      subject,
      htmlString,
      replyTo,
      messageStream: 'broadcasts',
    });
  }
}

// curl "https://api.postmarkapp.com/email" \
//   -X POST \
//   -H "Accept: application/json" \
//   -H "Content-Type: application/json" \
//   -H "X-Postmark-Server-Token: server token" \
//   -d '{
//   "From": "sender@example.com",
//   "To": "receiver@example.com",
//   "Subject": "Postmark test",
//   "TextBody": "Hello dear Postmark user.",
//   "HtmlBody": "<html><body><strong>Hello</strong> dear Postmark user.</body></html>",
//   "MessageStream": "outbound"
// }'
