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

test('can message attendees', async ({page}) => {
  test.setTimeout(120000);
  await login({page, email: user_2_email});
  await page.goto(getBaseUrl());
  await createEvent({page, authorId: organization_2_id});
  await publishCurrentEvent({page});
  await page.goto(`${getBaseUrl()}/dashboard`);

  await page.locator('[data-testid="filter-button"]').click();
  await page
    .locator('[data-testid="filter-option-button"]')
    .getByText('Organizing')
    .click();
  await page.locator('[data-testid="event-card"]').first().click();
  await page.locator('[data-testid="manage-event-button"]').click();
  await page
    .locator('[data-testid="select-option-button"]')
    .getByText('Attendees')
    .click();
  await page.locator('[data-testid="message-attendees-button"]').click();
  await page
    .locator('[data-testid="message-attendees-input-subject"]')
    .type('Test subject');
  await page
    .locator('[data-testid="message-attendees-input-message"]')
    .type('Test message');
  await page.locator('[data-testid="message-attendees-form-submit"]').click();

  await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
});
