import {isProd} from './isProd';

export const getBaseUrl = () => {
  if (isProd) {
    return 'https://www.wannago.app';
  }

  if (process.env.NEXT_PUBLIC_BASE_URL_OVERRIDE) {
    return `https://${process.env.NEXT_PUBLIC_BASE_URL_OVERRIDE}`;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return 'https://www.wannago.app';
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
