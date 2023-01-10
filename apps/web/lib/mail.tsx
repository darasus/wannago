import {getBaseUrl} from '../utils/getBaseUrl';

export class Mail {
  async sendEventSignUpEmail({
    eventId,
    userId,
  }: {
    eventId: string;
    userId: string;
  }) {
    return fetch(`${getBaseUrl()}/api/mailgun/send-event-signup-email`, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        eventId,
      }),
    });
  }

  async sendQuestionToOrganizerEmail({
    eventId,
    organizerEmail,
    email,
    firstName,
    lastName,
    subject,
    message,
  }: {
    eventId: string;
    organizerEmail: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
  }) {
    return fetch(
      `${getBaseUrl()}/api/mailgun/send-question-to-organizer-email`,
      {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          organizerEmail,
          email,
          firstName,
          lastName,
          subject,
          message,
        }),
      }
    );
  }

  async sendMessageToEventSubscribersEmail({
    subject,
    message,
    eventId,
    organizerUserId,
  }: {
    subject: string;
    message: string;
    eventId: string;
    organizerUserId: string;
  }) {
    return fetch(
      `${getBaseUrl()}/api/mailgun/send-message-to-event-subscribers-email`,
      {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          organizerUserId,
          subject,
          message,
        }),
      }
    );
  }

  async sendEventReminderEmail({eventId}: {eventId: string}) {
    return fetch(`${getBaseUrl()}/api/mailgun/send-event-reminder-email`, {
      method: 'POST',
      body: JSON.stringify({
        eventId,
      }),
    });
  }
}
