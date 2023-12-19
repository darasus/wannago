import {z} from 'zod';

export const clientSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string(),
  NEXT_PUBLIC_VERCEL_ENV: z.string(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string(),
});

export const clientEnv: {
  [k in keyof z.infer<typeof clientSchema>]:
    | z.infer<typeof clientSchema>[k]
    | undefined;
} = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
};
