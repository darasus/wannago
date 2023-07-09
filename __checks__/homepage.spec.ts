import {test, expect} from '@playwright/test';

test.use({actionTimeout: 10000});

test('Checkly Homepage', async ({page}) => {
  const response = await page.goto(process.env.ENVIRONMENT_URL!);
  expect(response?.status()).toBeLessThan(400);
  await expect(page).toHaveTitle(/WannaGo/);
  await page.screenshot({path: 'homepage.jpg'});
});
