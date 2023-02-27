import {getBaseUrl} from 'utils';

export class Telegram {
  async sendMessageToWannaGoChannel({message}: {message: string}) {
    return fetch(
      `${getBaseUrl()}/api/telegram/send-message-to-wannago-channel`,
      {
        method: 'POST',
        body: JSON.stringify({
          message,
        }),
      }
    );
  }
}
