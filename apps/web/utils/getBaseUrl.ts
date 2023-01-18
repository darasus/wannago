import {env} from 'client-env';

export const getBaseUrl = () => {
  return env.NEXT_PUBLIC_BASE_URL;
};
