import {test, expect} from '@playwright/test';
import {
  organization_1_email,
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

const getNewEmail = () => {
  const emailParts = user_1_email.split('@');

  return `${emailParts[0]}+${Math.random()}@${emailParts[1]}`;
};

test('can invite attendees', async ({page}) => {
  test.setTimeout(120000);
  const newEmail = getNewEmail();
  await login({page, email: user_2_email});
  await page.goto(getBaseUrl());
  await createEvent({page, authorId: organization_2_id});
  await publishCurrentEvent({page});

  await page.getByRole('button').getByText('manage event').click();
  await page
    .locator('[data-testid="select-option-button"]')
    .getByText('Attendees')
    .click();
  await page.locator('[data-testid="invite-button"]').click();
  await page
    .locator('[data-testid="invite-by-email-open-modal-button"]')
    .click();
  await page
    .locator('[data-testid="invite-by-email-first-name-input"]')
    .type('John');
  await page
    .locator('[data-testid="invite-by-email-last-name-input"]')
    .type('Doe');
  await page
    .locator('[data-testid="invite-by-email-email-input"]')
    .type(newEmail);
  await page.locator('[data-testid="invite-by-email-submit-button"]').click();

  await expect(
    page.locator('[data-testid="invitee-card"]').first().getByText(newEmail)
  ).toBeDefined();

  await expect(
    page
      .locator('[data-testid="sign-up-status-badge"]')
      .first()
      .getByText('Invited')
  ).toBeVisible({timeout: 20000});
});
