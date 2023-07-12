import {expect, test} from '@playwright/test';
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

test('can update user', async ({page}) => {
  test.setTimeout(120000);

  const firstName = 'John' + Math.random();
  const lastName = 'Doe' + Math.random();

  await login({page, email: user_1_email});

  await page.goto(`${getBaseUrl()}/settings`);

  await page.locator('[data-testid="first-name-input"]').clear();
  await page.locator('[data-testid="first-name-input"]').type(firstName);
  await page.locator('[data-testid="last-name-input"]').clear();
  await page.locator('[data-testid="last-name-input"]').type(lastName);
  await page.locator('[data-testid="user-settings-submit-button"]').click();

  await expect(
    page.locator('[data-testid="header-user-button"]')
  ).toContainText(firstName);
});
