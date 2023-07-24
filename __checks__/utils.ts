import {Page, expect} from '@playwright/test';
import {getBaseUrl} from './utils/getBaseUrl';

export async function login({page, email}: {page: Page; email: string}) {
  const currentUrl = page.url();
  if (currentUrl !== getBaseUrl()) {
    await page.goto(getBaseUrl());
  }
  await page.locator('[data-testid="login-button"]').click();
  await page.locator('[data-testid="login-email-input"]').type(email);
  await page.locator('[data-testid="login-email-form-submit"]').click();
  await page.locator('[data-testid="login-code-input"]').type('424242');
  await expect(page.locator('[data-testid="header-user-button"]')).toBeVisible({
    timeout: 20 * 1000,
  });
}

export async function logout({page}: {page: Page}) {
  await page.locator('[data-testid="header-user-button"]').click();
  await page.locator('[data-testid="logout-button"]').click();
  await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
}

export async function createEvent({
  page,
  authorId,
}: {
  page: Page;
  authorId?: string;
}) {
  await page.goto(`${getBaseUrl()}/dashboard`);
  await page.locator('[data-testid="add-event-button"]').click();

  if (authorId) {
    await page.locator('[data-testid="event-form-created-by-input"]').click();
    await page.locator(`[data-testid="created-by-option-${authorId}"]`).click();
  }

  await page.locator('[data-testid="event-form-title"]').type('Test title');
  await page.locator('[data-testid="event-form-description"]').click();
  await page
    .locator('[data-testid="event-form-description"]')
    .type('Test description');

  //   await page
  //     .locator('[data-testid="file-input"]')
  //     .selectFile('cypress/support/event-preview.jpg', {force: true});

  await page
    .locator(
      '[data-testid="event-form-start-date"] > [data-testid="calendar-button"]'
    )
    .click();
  await page.locator('[data-testid="calendar-next-month-button"]').click();
  await page
    .locator('[data-testid="calendar-date-button"]')
    .getByText('20')
    .click();
  await page
    .locator(
      '[data-testid="event-form-end-date"] > [data-testid="calendar-button"]'
    )
    .click();
  await page.locator('[data-testid="calendar-next-month-button"]').click();
  await page
    .locator('[data-testid="calendar-date-button"]')
    .getByText('21')
    .click();

  await page.locator('[data-testid="event-form-address-button"]').click();
  await page.locator('[data-testid="event-form-address-input"]').type('Paris');
  await page.locator('[data-testid="location-input-option"]').first().click();

  await page.locator('[data-testid="event-form-max-attendees"]').type('10');
  await page.locator('[data-testid="file-input-image-preview"]');
  await page.locator('[data-testid="event-form-submit-button"]').click();

  await expect(page.locator('[data-testid="event-title"]')).toBeVisible({
    timeout: 10000,
  });
}

export async function publishCurrentEvent({page}: {page: Page}) {
  await page.locator('[data-testid="manage-event-button"]').click();
  await page
    .locator('[data-testid="select-option-button"]')
    .getByText('Publish')
    .click();
  await page.locator('[data-testid="confirm-dialog-confirm-button"]').click();

  await expect(
    await page.locator('[data-testid="event-published-badge"]')
  ).toBeVisible({timeout: 10000});
}
