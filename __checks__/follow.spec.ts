import {test, expect} from '@playwright/test';
import {
  baseUrl,
  organization_2_id,
  user_1_email,
  user_2_email,
} from './constants';
import {createEvent, login, logout, publishCurrentEvent} from './utils';
import {resetDB} from './utils/resetDB';

test.use({
  actionTimeout:
    process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
  navigationTimeout:
    process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
  ignoreHTTPSErrors: true,
  baseURL: baseUrl,
});

test.beforeEach(async () => {
  await resetDB();
});

test('can follow organization', async ({page}) => {
  await login({page, email: user_2_email});
  await page.goto(baseUrl);
  await createEvent({page, authorId: organization_2_id});
  await publishCurrentEvent({page});
  await logout({page});
  await login({page, email: user_1_email});
  await page.goto(`${baseUrl}/o/${organization_2_id}`);
  await page.locator('[data-testid="follow-button"]').click();

  await page.waitForResponse(/trpc/);

  await expect(page.locator('[data-testid="follower-count"]')).toContainText(
    '1'
  );

  await page.goto(`${baseUrl}/dashboard`);
  await page.locator('[data-testid="filter-button"]').click();
  await page
    .locator('[data-testid="filter-option-button"]')
    .getByText('Following')
    .click();

  await expect(
    page.locator('[data-testid="event-card"]').first()
  ).toContainText('Organization 2');
});
