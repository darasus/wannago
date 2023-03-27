import {z} from 'zod';

export const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  CLOUDFLARE_API_KEY: z.string(),
  QSTASH_TOKEN: z.string(),
  POSTMARK_API_KEY: z.string(),
  TELEGRAM_CHAT_BOT_TOKEN: z.string(),
  TELEGRAM_CHANNEL_ID: z.string(),
  CLERK_API_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']),
});
