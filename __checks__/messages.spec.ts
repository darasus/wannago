import {expect, test} from '@playwright/test';
import {organization_2_id, user_1_email, user_2_id} from './constants';
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

test('can send message to organization', async ({page}) => {
  test.setTimeout(120000);
  await login({page, email: user_1_email});
  const randomMessage = 'Message ' + Math.random();

  await page.goto(`${getBaseUrl()}/o/${organization_2_id}`);
  await page.locator('[data-testid="message-button"]').click();
  await page.locator('[data-testid="message-input"]').type(randomMessage);
  await page.locator('[data-testid="message-form-submit-button"]').click();
  await expect(
    page.locator('[data-testid="message-text"]').last()
  ).toContainText(randomMessage);
});

test('can send message to user', async ({page}) => {
  test.setTimeout(120000);
  await login({page, email: user_1_email});
  const randomMessage = 'Message ' + Math.random();

  await page.goto(`${getBaseUrl()}/u/${user_2_id}`);
  await page.locator('[data-testid="message-button"]').click();
  await page.locator('[data-testid="message-input"]').type(randomMessage);
  await page.locator('[data-testid="message-form-submit-button"]').click();

  await expect(
    page.locator('[data-testid="message-text"]').last()
  ).toContainText(randomMessage);
});
