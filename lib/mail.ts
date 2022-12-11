import {Event, User} from '@prisma/client';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import {MailgunMessageData} from 'mailgun.js/interfaces/Messages';
import {createEventSubscribeEmailTemplate} from '../utils/createEventSubscribeEmailTemplate';
import {getBaseUrl} from '../utils/getBaseUrl';

const mailgunIstance = new Mailgun(formData);
const mailgun = mailgunIstance.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
});

export class Mail {
  mailgun = mailgun;

  async sendEventSignupEmail({event, user}: {event: Event; user: User}) {
    const messageData: MailgunMessageData = {
      from: 'WannaGo Team <hi@wannago.app>',
      to: user.email,
      subject: `Thanks for signing up for "${event.title}"!`,
      html: createEventSubscribeEmailTemplate(event),
    };

    await this.mailgun.messages.create('email.wannago.app', messageData);
  }

  async sendQuestionToOrganizer({
    event,
    organizerEmail,
    email,
    firstName,
    lastName,
    subject,
    message,
  }: {
    event: Event;
    organizerEmail: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const eventUrl = `${getBaseUrl()}/e/${event?.shortId}`;

    const messageData = {
      from: `${firstName} ${lastName} <${email}>`,
      to: organizerEmail,
      subject: 'Someone asked you a question on WannaGo',
      html: `
          <div>
            <div>Event: <a href="${eventUrl}" target="_blank">${event?.title}</a></div>
            <div>Email: ${email}</div>
            <div>Name: ${firstName} ${lastName}</div>
            <div>Subject: ${subject}</div>
            <div>Message: ${message}</div>
          </div>
        `,
    };

    await this.mailgun.messages.create('email.wannago.app', messageData);
  }

  async sendEventReminderEmail({event, users}: {event: Event; users: User[]}) {
    const eventUrl = `${getBaseUrl()}/e/${event?.shortId}`;

    await Promise.all(
      users.map(async user => {
        const messageData = {
          from: 'WannaGo Team <hi@wannago.app>',
          to: user.email,
          subject: `Your event is coming up! "${event.title}"!`,
          html: `
            <div>
              <div>Your event is comming up:</div>
              <div>Event: <a href="${eventUrl}" target="_blank">${event?.title}</a></div>
            </div>
          `,
        };

        await this.mailgun.messages.create('email.wannago.app', messageData);
      })
    );
  }
}
