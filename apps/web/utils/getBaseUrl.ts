import {env} from '../lib/env/client';

export const getBaseUrl = () => {
  if (env.NEXT_PUBLIC_BASE_URL) {
    return env.NEXT_PUBLIC_BASE_URL;
  }

  const vercelUrl =
    process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

  if (vercelUrl?.startsWith('localhost')) {
    return `http://${vercelUrl}`;
  }

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return 'http://localhost:3000';
};
