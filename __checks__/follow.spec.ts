import {test, expect} from '@playwright/test';
import {
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

test.skip('can follow organization', async ({page}) => {
  test.setTimeout(120000);
  await login({page, email: user_1_email});
  await page.goto(`${getBaseUrl()}/o/${organization_2_id}`);

  if (await page.getByRole('button').getByText('unfollow').isVisible()) {
    await page.getByRole('button').getByText('unfollow').click();
  }

  await page.getByRole('button').getByText('follow').click();

  await expect(page.getByRole('button').getByText('unfollow')).toBeVisible();
});

test.skip('can follow user', async ({page}) => {
  test.setTimeout(120000);
  await login({page, email: user_1_email});
  await page.goto(`${getBaseUrl()}/u/${user_2_id}`);

  const followResponsePromise = page.waitForResponse((resp) => {
    return resp.url().includes('follow.follow');
  });

  if (await page.getByRole('button').getByText('unfollow').isVisible()) {
    const unfollowResponsePromise = page.waitForResponse((resp) => {
      return resp.url().includes('follow.unfollow');
    });
    await page.getByRole('button').getByText('unfollow').click();
    await page.waitForTimeout(1000);
    await unfollowResponsePromise;
  }

  await page.getByRole('button').getByText('follow').click();

  await followResponsePromise;

  await expect(page.getByRole('button').getByText('unfollow')).toBeVisible();
});
