import {env} from 'server-env';
import {z} from 'zod';

const scheme = z.object({
  from: z.string().email(),
  to: z.string().email(),
  subject: z.string(),
  htmlString: z.string(),
});

type Input = z.input<typeof scheme>;

export class Postmark {
  sendTransactionalEmail({from, to, subject, htmlString}: Input) {
    return fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': env.POSTMARK_API_KEY,
      },
      body: JSON.stringify({
        From: from,
        To: to,
        Subject: subject,
        HtmlBody: htmlString,
        MessageStream: 'outbound',
      }),
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
