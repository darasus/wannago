import {test, expect} from '@playwright/test';

test('Custom Browser Check', async ({page}) => {
  const response = await page.goto(process.env.ENVIRONMENT_URL!);
  expect(response?.status()).toBeLessThan(400);
  await page.screenshot({path: 'screenshot.jpg'});
});
