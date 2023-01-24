import {Event, User} from '@prisma/client';
import formData from 'form-data';
import MailgunClient from 'mailgun.js';
import {MailgunMessageData} from 'mailgun.js/interfaces/Messages';
import {getBaseUrl} from '../utils/getBaseUrl';
import {render} from '@react-email/render';
import {EventReminder, LoginCode} from 'email';
import {env} from 'server-env';

const mailgunIstance = new MailgunClient(formData);
const mailgun = mailgunIstance.client({
  username: 'api',
  key: env.MAILGUN_API_KEY!,
});

export class Mailgun {
  mailgun = mailgun;

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
              startDate="In few hours"
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
