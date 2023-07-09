import {test, expect} from '@playwright/test';
import {user_1_email} from './constants';

test.use({actionTimeout: 10000});

test('can login', async ({page}) => {
  await page.goto(process.env.ENVIRONMENT_URL!);
  await page.locator('[data-testid="login-button"]').click();
  await page.locator('[data-testid="login-email-input"]').type(user_1_email);
  await page.locator('[data-testid="login-email-form-submit"]').click();
  await page.locator('[data-testid="login-code-input"]').type('424242');

  await expect(page.locator('[data-testid="header-user-button"]')).toBeVisible({
    timeout: 10000,
  });
});
