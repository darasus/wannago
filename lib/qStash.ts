import {Event} from '@prisma/client';
import {Client} from '@upstash/qstash';
import {differenceInSeconds, sub} from 'date-fns';

const queue = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export class QStash {
  qStash = queue;

  private createDelay({startDate}: {startDate: Date}) {
    const now = new Date();
    const notifyTime = sub(new Date(startDate), {
      hours: 3,
    });
    const delay = differenceInSeconds(notifyTime, now);

    return delay;
  }

  async scheduleEventEmail({event}: {event: Event}) {
    const message = await this.qStash.publishJSON({
      body: {
        eventId: event.id,
      },
      retries: 3,
      delay: this.createDelay({startDate: event.startDate}),
      url: `https://www.wannago.app/api/cron/event-reminder`,
    });

    return message;
  }

  async updateEventEmailSchedule({event}: {event: Event}) {
    if (event.messageId) {
      await this.qStash.messages.delete({
        id: event.messageId,
      });
    }

    return this.scheduleEventEmail({event});
  }
}
