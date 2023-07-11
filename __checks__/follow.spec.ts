import {test, expect} from '@playwright/test';
import {organization_2_id, user_1_email, user_2_email} from './constants';
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
  await login({page, email: user_2_email});
  await page.goto(getBaseUrl());
  await createEvent({page, authorId: organization_2_id});
  await publishCurrentEvent({page});
  await logout({page});
  await login({page, email: user_1_email});
  await page.goto(`${getBaseUrl()}/o/${organization_2_id}`);

  const hasUnfollowButton = await page
    .locator('[data-testid="unfollow-button"]')
    .isVisible();

  if (hasUnfollowButton) {
    await page.locator('[data-testid="unfollow-button"]').click();
    await page.locator('[data-testid="follow-button"]').isVisible();
  }

  await page.locator('[data-testid="follow-button"]').click();
  await page.locator('[data-testid="unfollow-button"]').isVisible();

  await expect(
    page.locator('[data-testid="follower-count"]').getByText('1')
  ).toBeVisible({timeout: 10000});

  await page.goto(`${getBaseUrl()}/dashboard`);
  await page.locator('[data-testid="filter-button"]').click();
  await page
    .locator('[data-testid="filter-option-button"]')
    .getByText('Following')
    .click();

  await expect(
    page.locator('[data-testid="event-card"]').first()
  ).toContainText('Organization 2');
});
