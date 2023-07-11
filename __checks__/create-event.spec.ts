import {test} from '@playwright/test';
import {baseUrl, user_1_email, user_1_id} from './constants';
import {createEvent, login} from './utils';

test.use({
  actionTimeout:
    process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
  navigationTimeout:
    process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
  ignoreHTTPSErrors: true,
});

test('can create free event', async ({page}) => {
  await page.goto(baseUrl);
  await login({page, email: user_1_email});
  await createEvent({page, authorId: user_1_id});
});
