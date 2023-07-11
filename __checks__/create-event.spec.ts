import {test} from '@playwright/test';
import {baseUrl, user_1_email, user_1_id} from './constants';
import {createEvent, login} from './utils';
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

test('can create free event', async ({page}) => {
  await page.goto('/');
  await login({page, email: user_1_email});
  await createEvent({page, authorId: user_1_id});
});
