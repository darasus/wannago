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

  publish({
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

  async enqueueReminderEmail(body: {
    eventId: string;
    startDate: Date;
    timezone: string;
  }) {
    const {eventId, startDate, timezone} = body;
    if (!canCreateReminder(startDate, timezone)) {
      return null;
    }

    return this.publish({
      body: {
        eventId,
        type: EmailType.EventReminder,
      },
      delay: createDelay({startDate}),
    });
  }

  async updateReminderEmail({
    messageId,
    timezone,
    startDate,
    eventId,
  }: {
    eventId: string;
    messageId: string | undefined | null;
    timezone: string;
    startDate: Date;
  }) {
    if (messageId) {
      await this.queue.messages.delete({
        id: messageId,
      });
    }

    if (!canCreateReminder(startDate, timezone)) {
      return null;
    }

    return this.enqueueReminderEmail({eventId, timezone, startDate});
  }
}
