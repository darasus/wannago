import {z} from 'zod';

export const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  CLOUDFLARE_API_KEY: z.string(),
  QSTASH_TOKEN: z.string(),
  OPENAI_API_KEY: z.string(),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']),
  STRIPE_API_SECRET: z.string(),
  STRIPE_ENDPOINT_SECRET: z.string(),
  STABILITY_AI_API_KEY: z.string(),
  RESEND_API_KEY: z.string(),
});
