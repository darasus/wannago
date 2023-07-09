import {test, expect} from '@playwright/test';

test('Checkly Homepage', async ({page}) => {
  const response = await page.goto('https://wannago.app');
  expect(response?.status()).toBeLessThan(400);
  await expect(page).toHaveTitle(/WannaGo/);
  await page.screenshot({path: 'homepage.jpg'});
});
