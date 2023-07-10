import {test, expect} from '@playwright/test';
import {testUrl, user_1_email, user_1_id} from './constants';
import {createEvent, login, publishCurrentEvent} from './utils';

test.use({
  actionTimeout: 20000,
  navigationTimeout: 20000,
  ignoreHTTPSErrors: true,
});

test('can sign up to free event', async ({page}) => {
  await page.goto(process.env.ENVIRONMENT_URL || testUrl);
  await login({page, email: user_1_email});
  await createEvent({page, authorId: user_1_id});
  await publishCurrentEvent({page});
  await page.locator('[data-testid="attend-button"]').click();
  await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
});
