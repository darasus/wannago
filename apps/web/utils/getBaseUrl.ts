import {env} from '../lib/env/client';

export const getBaseUrl = () => {
  return env.NEXT_PUBLIC_BASE_URL;
};
