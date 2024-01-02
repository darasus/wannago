import {z} from 'zod';

export const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']),
  STRIPE_API_SECRET: z.string(),
  STRIPE_ENDPOINT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  OAUTH_GOOGLE_CLIENT_ID: z.string().optional(),
  OAUTH_GOOGLE_CLIENT_SECRET: z.string().optional(),
});
