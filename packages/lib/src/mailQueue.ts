import {Client} from '@upstash/qstash';
import {differenceInSeconds, sub} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import {env} from 'server-env';
import {EmailType} from '../../../apps/web/src/types/EmailType';

const REMINDER_PERIOD_IN_SECONDS = 60 * 60 * 3;

export class MailQueue {
  private queue = new Client({
    token: env.QSTASH_TOKEN!,
  });

  publish({
    type,
    delay,
    body,
  }: {
    type: EmailType;
    body: {[key: string]: string};
    delay?: number;
  }) {
    if (env.VERCEL_ENV === 'production') {
      return this.queue.publishJSON({
        body: {
          ...body,
          type,
        },
        retries: 5,
        url: `https://www.wannago.app/api/handle-email`,
        delay,
      });
    }
  }

  async enqueueEventSignUpEmail(body: {eventId: string; userId: string}) {
    return this.publish({body, type: EmailType.EventSignUp});
  }

  async enqueueEventInviteEmail(body: {eventId: string; userId: string}) {
    return this.publish({body, type: EmailType.EventInvite});
  }

  async enqueueEventCancelSignUpEmail(body: {eventId: string; userId: string}) {
    return this.publish({body, type: EmailType.EventCancelSignUp});
  }

  async enqueueEventCancelInviteEmail(body: {eventId: string; userId: string}) {
    return this.publish({body, type: EmailType.EventCancelInvite});
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
      },
      type: EmailType.EventReminder,
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

function createDelay({startDate}: {startDate: Date}) {
  const now = new Date();
  const notifyTime = sub(new Date(startDate), {
    seconds: REMINDER_PERIOD_IN_SECONDS,
  });
  const delay = differenceInSeconds(notifyTime, now);

  return delay;
}

/**
 * Function returns true if the event start date is more than `REMINDER_PERIOD_IN_SECONDS` seconds away
 */
function canCreateReminder(startDate: Date, timezone: string) {
  const selectedDate = utcToZonedTime(startDate, timezone);
  const now = utcToZonedTime(new Date(), timezone);
  const secondsToStart = differenceInSeconds(selectedDate, now);
  const isWithinReminderPeriod =
    Math.sign(secondsToStart) !== -1 &&
    secondsToStart > REMINDER_PERIOD_IN_SECONDS;

  return isWithinReminderPeriod;
}
