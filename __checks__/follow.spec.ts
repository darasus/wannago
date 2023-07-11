import {test, expect} from '@playwright/test';
import {organization_2_id, user_1_email, user_2_email} from './constants';
import {createEvent, login, logout, publishCurrentEvent} from './utils';
import {resetDB} from './utils/resetDB';

test.beforeEach(async () => {
  await resetDB();
});

test('can follow organization', async ({page}) => {
  await login({page, email: user_2_email});
  await page.goto('/');
  await createEvent({page, authorId: organization_2_id});
  await publishCurrentEvent({page});
  await logout({page});
  await login({page, email: user_1_email});
  await page.goto(`/o/${organization_2_id}`);
  await page.locator('[data-testid="follow-button"]').click();

  await page.waitForResponse(/trpc/);

  await expect(page.locator('[data-testid="follower-count"]')).toContainText(
    '1'
  );

  await page.goto('/dashboard');
  await page.locator('[data-testid="filter-button"]').click();
  await page
    .locator('[data-testid="filter-option-button"]')
    .getByText('Following')
    .click();

  await expect(
    page.locator('[data-testid="event-card"]').first()
  ).toContainText('Organization 2');
});
