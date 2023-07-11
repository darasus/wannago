import {test} from '@playwright/test';
import {baseUrl, user_1_email} from './constants';
import {login} from './utils';
import {prepare} from './utils/prepare';

test.beforeAll(() => {
  test.use({
    actionTimeout:
      process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
    navigationTimeout:
      process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
    ignoreHTTPSErrors: true,
    baseURL: baseUrl,
  });
});

test('can login', async ({page}) => {
  await login({page, email: user_1_email});
});
