import {NextApiRequest, NextApiResponse} from 'next';
import TelegramBot from 'node-telegram-bot-api';
import {z} from 'zod';
import {env} from '../../../lib/env/server';

const scheme = z.object({
  message: z.string(),
});

const bot = new TelegramBot(env.TELEGRAM_CHAT_BOT_TOKEN, {polling: true});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const {message} = scheme.parse(JSON.parse(req.body));

  bot.sendMessage(env.TELEGRAM_CHANNEL_ID, message);

  res.status(200).json({success: true});
}
