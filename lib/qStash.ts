import {Client} from '@upstash/qstash';
import {differenceInSeconds, sub} from 'date-fns';

const queue = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export class QStash {
  qStash = queue;

  async scheduleEventEmail({
    startDate,
    eventId,
  }: {
    startDate: Date;
    eventId: string;
  }) {
    const now = new Date();
    const notifyTime = sub(new Date(startDate), {
      hours: 3,
    });
    const delay = differenceInSeconds(notifyTime, now);

    await this.qStash.publishJSON({
      body: {
        eventId,
      },
      retries: 3,
      delay,
      url: `https://www.wannago.app/api/cron/event-reminder`,
    });
  }
}
