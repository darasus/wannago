import {Client} from '@upstash/qstash';
import {env} from 'server-env';
import {EmailType} from 'types';
import {canCreateReminder, createDelay} from 'utils';
import {z} from 'zod';

const bodyValidation = z
  .object({
    type: z.nativeEnum(EmailType),
  })
  .passthrough();

export class MailQueue {
  private queue = new Client({
    token: env.QSTASH_TOKEN!,
  });

  addMessage({
    body,
    delay,
  }: {
    body: z.infer<typeof bodyValidation>;
    delay?: number;
  }) {
    if (env.VERCEL_ENV === 'production') {
      return this.queue.publishJSON({
        body,
        retries: 5,
        url: `https://www.wannago.app/api/handle-email`,
        delay,
      });
    }
  }

  removeMessage({messageId}: {messageId: string}) {
    return this.queue.messages.delete({
      id: messageId,
    });
  }
}
