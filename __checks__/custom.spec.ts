import {test, expect} from '@playwright/test';

test.use({actionTimeout: 10000});

test('Custom Browser Check', async ({page}) => {
  const response = await page.goto(process.env.ENVIRONMENT_URL!);
  expect(response?.status()).toBeLessThan(400);
  await page.screenshot({path: 'screenshot.jpg'});
});
