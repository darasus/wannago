import {test} from '@playwright/test';
import {user_1_email} from './constants';
import {login} from './utils';
import {getBaseUrl} from './utils/getBaseUrl';

test.use({
  actionTimeout:
    process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
  navigationTimeout:
    process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
  ignoreHTTPSErrors: true,
  baseURL: getBaseUrl(),
});

test('can login', async ({page}) => {
  test.setTimeout(120000);
  await login({page, email: user_1_email});
});
