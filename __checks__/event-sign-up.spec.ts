import {test, expect} from '@playwright/test';
import {user_1_email, user_1_id} from './constants';
import {createEvent, login, publishCurrentEvent} from './utils';
import {getBaseUrl} from './utils/getBaseUrl';

test.use({
  actionTimeout:
    process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
  navigationTimeout:
    process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
  ignoreHTTPSErrors: true,
  baseURL: getBaseUrl(),
});

test('can sign up (free event)', async ({page}) => {
  test.setTimeout(120000);
  await page.goto(getBaseUrl());
  await login({page, email: user_1_email});
  await createEvent({page, authorId: user_1_id});
  await publishCurrentEvent({page});
  await page.locator('[data-testid="attend-button"]').click();

  await expect(
    page.locator('[data-testid="event-signup-label"]')
  ).toBeVisible();
});

test('can cancel sign up (free event)', async ({page}) => {
  test.setTimeout(120000);
  await page.goto(getBaseUrl());
  await login({page, email: user_1_email});
  await createEvent({page, authorId: user_1_id});
  await publishCurrentEvent({page});
  await page.locator('[data-testid="attend-button"]').click();
  await page.locator('[data-testid="cancel-signup-button"]').click();
  await page.locator('[data-testid="confirm-dialog-confirm-button"]').click();

  await expect(page.locator('[data-testid="attend-button"]')).toBeVisible();
});
