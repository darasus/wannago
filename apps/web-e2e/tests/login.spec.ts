import {test, expect} from '@playwright/test';
import {Auth} from '../models/Auth';

test('Can login', async ({page}) => {
  const auth = new Auth(page);
  await auth.login();
  const el = await page.getByTestId('add-event-button');

  await page.reload();

  await expect(el).toBeVisible();
});
