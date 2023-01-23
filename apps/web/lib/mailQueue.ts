import {Client} from '@upstash/qstash';
import {env} from 'server-env';

export enum EmailType {
  EventSignUp = 'EventSignUp',
}

export class MailQueue {
  queue = new Client({
    token: env.QSTASH_TOKEN!,
  });

  publish({type, ...props}: Record<string, string> & {type: EmailType}) {
    return this.queue.publishJSON({
      body: {
        ...props,
        type,
      },
      retries: 5,
      // INFO: NEED to always use production email handler
      // to process requests from qstash
      url: `https://www.wannago.app/api/trpc/email.handle`,
      // url: `${getBaseUrl()}/api/email-handler`,
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
}
