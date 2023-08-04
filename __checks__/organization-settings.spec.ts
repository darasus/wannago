import {expect, test} from '@playwright/test';
import {organization_1_email, user_1_email} from './constants';
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

test('can update organization', async ({page}) => {
  test.setTimeout(120000);
  await login({page, email: user_1_email});

  await page.goto(`${getBaseUrl()}/dashboard`);

  await page.locator('[data-testid="header-user-button"]').click();
  await page.locator('[data-testid="organizations-button"]').click();
  await page
    .locator('[data-testid="organization-item-card-settings-button"]')
    .click();
  await page
    .locator('[data-testid="team-settings-form-input-name"]')
    .fill('Organization 1');
  await page
    .locator('[data-testid="team-settings-form-input-email"]')
    .fill(organization_1_email);
  await page.waitForTimeout(5000);
  await page
    .locator('[data-testid="team-settings-form-input-submit-button"]')
    .click();

  await expect(page.getByText('Organization is updated!')).toBeVisible({
    timeout: 10000,
  });
});
