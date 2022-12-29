import {Event, User} from '@prisma/client';
import formData from 'form-data';
import MailgunClient from 'mailgun.js';
import {MailgunMessageData} from 'mailgun.js/interfaces/Messages';
import {getBaseUrl} from '../utils/getBaseUrl';
import {render} from '@react-email/render';
import {
  EventSubscribe,
  MessageToOrganizer,
  EventReminder,
  MessageToAttendees,
  LoginCode,
} from 'email';
import {formatDate} from '../utils/formatDate';
import {env} from './env/server';

const mailgunIstance = new MailgunClient(formData);
const mailgun = mailgunIstance.client({
  username: 'api',
  key: env.MAILGUN_API_KEY!,
});

export class Mailgun {
  mailgun = mailgun;

  async sendEventSignupEmail({event, user}: {event: Event; user: User}) {
    const messageData: MailgunMessageData = {
      from: 'WannaGo Team <hi@wannago.app>',
      to: user.email,
      subject: `Thanks for signing up for "${event.title}"!`,
      html: render(
        <EventSubscribe
          title={event.title}
          address={event.address}
          eventUrl={`${getBaseUrl()}/e/${event.shortId}`}
          startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
          endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
        />
      ),
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
    const messageData = {
      from: `${firstName} ${lastName} <${email}>`,
      to: organizerEmail,
      subject: 'Someone asked you a question on WannaGo',
      html: render(
        <MessageToOrganizer
          eventTitle={event.title}
          eventUrl={`${getBaseUrl()}/e/${event?.shortId}`}
          message={message}
          subject={subject}
          senderName={`${firstName} ${lastName}`}
          senderEmail={email}
        />
      ),
    };

    await this.mailgun.messages.create('email.wannago.app', messageData);
  }

  async sendEventReminderEmail({event, users}: {event: Event; users: User[]}) {
    await Promise.all(
      users.map(async user => {
        const messageData = {
          from: 'WannaGo Team <hi@wannago.app>',
          to: user.email,
          subject: `Your event is coming up! "${event.title}"!`,
          html: render(
            <EventReminder
              title={event.title}
              address={event.address}
              eventUrl={`${getBaseUrl()}/e/${event.shortId}`}
              startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
              endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
            />
          ),
        };

        await this.mailgun.messages.create('email.wannago.app', messageData);
      })
    );
  }

  async sendMessageToEventParticipants({
    users,
    subject,
    message,
    event,
    organizerUser,
  }: {
    users: User[];
    subject: string;
    message: string;
    event: Event;
    organizerUser: User;
  }) {
    await Promise.all(
      users.map(async user => {
        const messageData = {
          from: `${organizerUser.firstName} ${organizerUser.lastName} <${organizerUser.email}>`,
          to: user.email,
          subject: `Message from event organizer: "${event.title}"`,
          html: render(
            <MessageToAttendees
              eventUrl={`${getBaseUrl()}/e/${event?.shortId}`}
              message={message}
              eventTitle={event.title}
              subject={subject}
            />
          ),
        };

        await this.mailgun.messages.create('email.wannago.app', messageData);
      })
    );
  }

  async sendLoginCodeEmail({
    code,
    email,
    subject,
  }: {
    code: string;
    email: string;
    subject: string;
  }) {
    const messageData: MailgunMessageData = {
      from: 'WannaGo Team <hi@wannago.app>',
      to: email,
      subject,
      html: render(<LoginCode code={code} />),
    };

    await this.mailgun.messages.create('email.wannago.app', messageData);
  }
}
