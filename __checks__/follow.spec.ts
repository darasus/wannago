import {test, expect} from '@playwright/test';
import {
  organization_2_id,
  user_1_email,
  user_1_id,
  user_2_email,
  user_2_id,
} from './constants';
import {createEvent, login, logout, publishCurrentEvent} from './utils';
import {getBaseUrl} from './utils/getBaseUrl';

test.use({
  actionTimeout:
    process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
  navigationTimeout:
    process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
  ignoreHTTPSErrors: true,
  baseURL: getBaseUrl(),
});

test('can follow organization', async ({page}) => {
  test.setTimeout(120000);
  await login({page, email: user_1_email});
  await page.goto(`${getBaseUrl()}/o/${organization_2_id}`);

  const hasUnfollowButton = await page.getByText('unfollow').isVisible();

  if (hasUnfollowButton) {
    await page.locator('[data-testid="unfollow-button"]').click();
  }

  await page.locator('[data-testid="follow-button"]').click({timeout: 20000});

  await page.waitForResponse(/rsc/);

  await expect(page.locator('[data-testid="unfollow-button"]')).toBeVisible({
    timeout: 20000,
  });
});

test('can follow user', async ({page}) => {
  test.setTimeout(120000);
  await login({page, email: user_1_email});
  await page.goto(`${getBaseUrl()}/u/${user_2_id}`);

  const hasUnfollowButton = await page.getByText('unfollow').isVisible();

  if (hasUnfollowButton) {
    await page.locator('[data-testid="unfollow-button"]').click();
  }

  await page.locator('[data-testid="follow-button"]').click({timeout: 20000});

  await page.waitForResponse(/rsc/);

  await expect(page.locator('[data-testid="unfollow-button"]')).toBeVisible({
    timeout: 20000,
  });
});
