import {z} from 'zod';

export const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  CLOUDFLARE_API_KEY: z.string(),
  QSTASH_TOKEN: z.string(),
  MAILGUN_API_KEY: z.string(),
});

export const clientSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string(),
  NEXT_PUBLIC_AMPLITUDE_API_KEY: z.string(),
});

export const clientEnv: {
  [k in keyof z.infer<typeof clientSchema>]:
    | z.infer<typeof clientSchema>[k]
    | undefined;
} = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_AMPLITUDE_API_KEY: process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
};
