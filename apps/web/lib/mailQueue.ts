import {Client} from '@upstash/qstash';
import {env} from 'server-env';
import {getBaseUrl} from '../utils/getBaseUrl';

export enum EmailType {
  EventSignUp = 'EventSignUp',
  EventInvite = 'EventInvite',
  MessageToOrganizer = 'MessageToOrganizer',
  MessageToAllAttendees = 'MessageToAllAttendees',
}

export class MailQueue {
  private queue = new Client({
    token: env.QSTASH_TOKEN!,
  });

  private publish({
    type,
    ...props
  }: Record<string, string> & {type: EmailType}) {
    return this.queue.publishJSON({
      body: {
        ...props,
        type,
      },
      retries: 5,
      url: `${getBaseUrl()}/api/handle-email`,
    });
  }

  async sendEventSignUpEmail({
    eventId,
    userId,
  }: {
    eventId: string;
    userId: string;
  }) {
    return this.publish({eventId, userId, type: EmailType.EventSignUp});
  }

  async sendEventInviteEmail({
    eventId,
    userId,
  }: {
    eventId: string;
    userId: string;
  }) {
    return this.publish({eventId, userId, type: EmailType.EventInvite});
  }

  async sendQuestionToOrganizerEmail(props: {
    eventId: string;
    organizerEmail: string;
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    subject: string;
  }) {
    return this.publish({...props, type: EmailType.MessageToOrganizer});
  }

  async sendMessageToAllAttendeesEmail(props: {
    subject: string;
    message: string;
    eventId: string;
    organizerUserId: string;
  }) {
    return this.publish({...props, type: EmailType.MessageToAllAttendees});
  }
}
