import {Event} from '@prisma/client';
import {Client} from '@upstash/qstash';
import {differenceInSeconds, sub} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import {env} from 'server-env';

export const REMINDER_PERIOD_IN_SECONDS = 60 * 60 * 3;

const queue = new Client({
  token: env.QSTASH_TOKEN!,
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

  isWithinReminderPeriod(startDate: Date, timezone: string) {
    const selectedDate = utcToZonedTime(startDate, timezone);
    const now = utcToZonedTime(new Date(), timezone);
    const secondsToStart = differenceInSeconds(selectedDate, now);
    const isWithinReminderPeriod =
      Math.sign(secondsToStart) !== -1 &&
      secondsToStart > REMINDER_PERIOD_IN_SECONDS;

    return isWithinReminderPeriod;
  }

  async createEventEmailSchedule({
    event,
    timezone,
  }: {
    event: Event;
    timezone: string;
  }) {
    if (!this.isWithinReminderPeriod(event.startDate, timezone)) {
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
    timezone,
  }: {
    event: Event;
    timezone: string;
  }) {
    if (event.messageId) {
      await this.qStash.messages.delete({
        id: event.messageId,
      });
    }

    if (!this.isWithinReminderPeriod(event.startDate, timezone)) {
      return null;
    }

    return this.createEventEmailSchedule({event, timezone});
  }
}
