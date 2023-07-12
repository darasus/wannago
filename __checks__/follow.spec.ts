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
  await login({page, email: user_2_email});
  await page.goto(getBaseUrl());
  await createEvent({page, authorId: organization_2_id});
  await publishCurrentEvent({page});
  await logout({page});
  await login({page, email: user_1_email});
  await page.goto(`${getBaseUrl()}/o/${organization_2_id}`);

  const hasUnfollowButton = await page.getByText('unfollow').isVisible();

  if (hasUnfollowButton) {
    await page
      .locator('[data-testid="unfollow-button"]')
      .getByText('unfollow')
      .click();

    await page
      .locator('[data-testid="follow-button"]')
      .getByText('follow')
      .isVisible();
  }

  await page
    .locator('[data-testid="follow-button"]')
    .getByText('follow')
    .click();

  await page
    .locator('[data-testid="unfollow-button"]')
    .getByText('unfollow')
    .isVisible();

  await page.locator('[data-testid="logo-link"]').click();

  await page.locator('[data-testid="filter-button"]').click();

  await page
    .locator('[data-testid="filter-option-button"]')
    .getByText('Following')
    .click();

  await expect(
    page
      .locator('[data-testid="event-card"]')
      .getByText('Organization 2')
      .nth(0)
  ).toBeVisible({timeout: 60 * 1000});
});

test('can follow user', async ({page}) => {
  test.setTimeout(120000);
  await login({page, email: user_2_email});
  await page.goto(getBaseUrl());
  await createEvent({page, authorId: user_2_id});
  await publishCurrentEvent({page});
  await logout({page});
  await login({page, email: user_1_email});
  await page.goto(`${getBaseUrl()}/u/${user_2_id}`);

  const hasUnfollowButton = await page.getByText('unfollow').isVisible();

  if (hasUnfollowButton) {
    await page
      .locator('[data-testid="unfollow-button"]')
      .getByText('unfollow')
      .click();

    await page
      .locator('[data-testid="follow-button"]')
      .getByText('follow')
      .isVisible();
  }

  await page
    .locator('[data-testid="follow-button"]')
    .getByText('follow')
    .click();

  await page
    .locator('[data-testid="unfollow-button"]')
    .getByText('unfollow')
    .isVisible();

  await page.locator('[data-testid="logo-link"]').click();

  await page.locator('[data-testid="filter-button"]').click();

  await page
    .locator('[data-testid="filter-option-button"]')
    .getByText('Following')
    .click();

  await expect(
    page
      .locator('[data-testid="event-card"]')
      .getByText('Organization 2')
      .nth(0)
  ).toBeVisible({timeout: 60 * 1000});
});
