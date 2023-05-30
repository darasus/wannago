import * as Sentry from '@sentry/nextjs';
import {ProfilingIntegration} from '@sentry/profiling-node';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  enabled: process.env.VERCEL_ENV === 'production',
  integrations: [new ProfilingIntegration()],
});
