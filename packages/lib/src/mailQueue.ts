import {EmailType} from '@prisma/client';
import {Client} from '@upstash/qstash';
import {differenceInSeconds, sub} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import {env} from 'server-env';

const REMINDER_PERIOD_IN_SECONDS = 60 * 60 * 3;

export class MailQueue {
  private queue = new Client({
    token: env.QSTASH_TOKEN!,
  });

  private publish({
    type,
    delay,
    body,
  }: {
    type: EmailType;
    delay?: number;
    body: {[key: string]: string};
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

  async enqueueMessageToOrganizerEmail(body: {
    eventId: string;
    organizerEmail: string;
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    subject: string;
  }) {
    return this.publish({body, type: EmailType.MessageToOrganizer});
  }

  async enqueueMessageToAllAttendeesEmail(body: {
    subject: string;
    message: string;
    eventId: string;
    organizerUserId: string;
  }) {
    return this.publish({body, type: EmailType.MessageToAllAttendees});
  }

  /**
   * This is a organizer notification email when new user sign ups to an event
   */
  async enqueueOrganizerEventSignUpNotificationEmail(body: {
    userId: string;
    eventId: string;
  }) {
    return this.publish({
      body,
      type: EmailType.OrganizerEventSignUpNotification,
    });
  }

  /**
   * This is a follow up email to the organizer if they have not created an event in 2 days
   */
  async enqueueAfterRegisterNoCreatedEventFollowUpEmail(body: {
    userId: string;
  }) {
    return this.publish({
      body,
      type: EmailType.AfterRegisterNoCreatedEventFollowUpEmail,
      delay: 60 * 60 * 24 * 2,
    });
  }

  /**
   * This is a reminder email for upcoming events
   */
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
