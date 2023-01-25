import {Client} from '@upstash/qstash';
import {env} from 'server-env';
import {getBaseUrl} from '../utils/getBaseUrl';

export enum EmailType {
  EventSignUp = 'EventSignUp',
  EventInvite = 'EventInvite',
  MessageToOrganizer = 'MessageToOrganizer',
  MessageToAllAttendees = 'MessageToAllAttendees',
  AfterRegisterNoCreatedEventFollowUpEmail = 'AfterRegisterNoCreatedEventFollowUpEmail',
}

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

  async sendEventSignUpEmail(body: {eventId: string; userId: string}) {
    return this.publish({body, type: EmailType.EventSignUp});
  }

  async sendEventInviteEmail(body: {eventId: string; userId: string}) {
    return this.publish({body, type: EmailType.EventInvite});
  }

  async sendQuestionToOrganizerEmail(body: {
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

  async sendMessageToAllAttendeesEmail(body: {
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
      // delay: 60 * 60 * 24 * 2,
      delay: 10,
    });
  }
}
