// @ts-check
/**
 * This file is included in `/next.config.mjs` which ensures the app isn't built with invalid env vars.
 * It has to be a `.mjs`-file to be imported there.
 */
import {serverSchema} from './schema';
import {env as clientEnv, formatErrors} from './client';

const _serverEnv = serverSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  CLOUDFLARE_API_KEY: process.env.CLOUDFLARE_API_KEY,
  QSTASH_TOKEN: process.env.QSTASH_TOKEN,
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
  TELEGRAM_CHAT_BOT_TOKEN: process.env.TELEGRAM_CHAT_BOT_TOKEN,
  TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID,
});

if (!_serverEnv.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    ...formatErrors(_serverEnv.error.format())
  );
  throw new Error('Invalid environment variables');
}

for (let key of Object.keys(_serverEnv.data)) {
  if (key.startsWith('NEXT_PUBLIC_')) {
    console.warn('❌ You are exposing a server-side env-variable:', key);

    throw new Error('You are exposing a server-side env-variable');
  }
}

export const env = {..._serverEnv.data, ...clientEnv};
