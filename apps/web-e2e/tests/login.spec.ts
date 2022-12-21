import {test, expect} from '@playwright/test';
import {Auth} from '../models/Auth';

test('Can login', async ({page}) => {
  const auth = new Auth(page);
  await auth.login();

  await page.goto('/dashboard');

  const el = await page.getByTestId('add-event-button');

  await expect(el).toBeVisible();
});
