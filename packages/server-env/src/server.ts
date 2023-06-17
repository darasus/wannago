import {ZodFormattedError} from 'zod';
import {env as clientEnv} from 'client-env';
import {serverSchema} from './schema';

export const formatErrors = (
  errors: ZodFormattedError<Map<string, string>, string>
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value)
        return `${name}: ${value._errors.join(', ')}\n`;
    })
    .filter(Boolean);

const _serverEnv = serverSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  CLOUDFLARE_API_KEY: process.env.CLOUDFLARE_API_KEY,
  QSTASH_TOKEN: process.env.QSTASH_TOKEN,
  POSTMARK_API_KEY: process.env.POSTMARK_API_KEY,
  VERCEL_ENV: process.env.VERCEL_ENV,
  CLERK_API_KEY: process.env.CLERK_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  STRIPE_API_SECRET: process.env.STRIPE_API_SECRET,
  STRIPE_ENDPOINT_SECRET: process.env.STRIPE_ENDPOINT_SECRET,
  STABILITY_AI_API_KEY: process.env.STABILITY_AI_API_KEY,
});

if (!_serverEnv.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    ...formatErrors(_serverEnv.error.format())
  );

  throw new Error('Invalid environment variables!');
}

for (let key of Object.keys(_serverEnv.data)) {
  if (key.startsWith('NEXT_PUBLIC_')) {
    console.warn('❌ You are exposing a server-side env-variable:', key);

    throw new Error('You are exposing a server-side env-variable');
  }
}

export const env = {..._serverEnv.data, ...clientEnv};
