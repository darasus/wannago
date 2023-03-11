import {env} from 'client-env';

export const getBaseUrl = () => {
  // return env.NEXT_PUBLIC_BASE_URL;

  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000`;
  }

  return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
};
