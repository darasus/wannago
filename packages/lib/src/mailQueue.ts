import {EmailType} from '@prisma/client';
import {Client} from '@upstash/qstash';
import {prisma} from 'database';
import {env} from 'server-env';

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
    return this.queue.publishJSON({
      body: {
        ...body,
        type,
      },
      retries: 5,
      // url: `${getBaseUrl()}/api/handle-email`,
      url: `https://www.wannago.app/api/handle-email`,
      delay,
    });
  }

  async enqueueEventSignUpEmail(body: {eventId: string; userId: string}) {
    return this.publish({body, type: EmailType.EventSignUp});
  }

  async enqueueEventCancelSignUpEmail(body: {eventId: string; userId: string}) {
    return this.publish({body, type: EmailType.EventCancelSignUp});
  }

  async enqueueEventInviteEmail(body: {eventId: string; userId: string}) {
    return this.publish({body, type: EmailType.EventInvite});
  }

  async enqueueEventCancelInviteEmail(body: {eventId: string; userId: string}) {
    return this.publish({body, type: EmailType.EventCancelInvite});
  }

  async enqueueQuestionToOrganizerEmail(body: {
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
}
