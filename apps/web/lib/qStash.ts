import {Event} from '@prisma/client';
import {Client} from '@upstash/qstash';
import {differenceInSeconds, sub} from 'date-fns';
import {REMINDER_PERIOD_IN_SECONDS} from '../constants';

const queue = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export class QStash {
  qStash = queue;

  private createDelay({startDate}: {startDate: Date}) {
    const now = new Date();
    const notifyTime = sub(new Date(startDate), {
      seconds: REMINDER_PERIOD_IN_SECONDS,
    });
    const delay = differenceInSeconds(notifyTime, now);

    return delay;
  }

  isWithinReminderPeriod(startDate: Date) {
    const secondsToStart = differenceInSeconds(startDate, new Date());
    const isWithinReminderPeriod =
      Math.sign(secondsToStart) !== -1 &&
      secondsToStart > REMINDER_PERIOD_IN_SECONDS;

    return isWithinReminderPeriod;
  }

  async createEventEmailSchedule({event}: {event: Event}) {
    if (!this.isWithinReminderPeriod(event.startDate)) {
      return null;
    }

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

  async updateEventEmailSchedule({
    event,
    isTimeChanged,
  }: {
    event: Event;
    isTimeChanged: boolean;
  }) {
    if (!isTimeChanged) {
      return null;
    }

    if (event.messageId) {
      await this.qStash.messages.delete({
        id: event.messageId,
      });
    }

    if (!this.isWithinReminderPeriod(event.startDate)) {
      return null;
    }

    return this.createEventEmailSchedule({event});
  }
}
