import {env} from 'client-env';
import getConfig from 'next/config';

const {publicRuntimeConfig} = getConfig();

export const getBaseUrl = () => {
  if (env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return `https://www.wannago.app`;
  }

  if (env.NEXT_PUBLIC_VERCEL_ENV === 'development') {
    return `http://localhost:3000`;
  }

  const url = publicRuntimeConfig.vercelBranchUrl;

  console.log('url', url);

  return url?.startsWith('http') ? url : `https://${url}`;
};
