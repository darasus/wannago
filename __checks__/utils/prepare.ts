import {test} from '@playwright/test';
import {baseUrl} from '../constants';

export function prepare() {
  test.use({
    actionTimeout:
      process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
    navigationTimeout:
      process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
    ignoreHTTPSErrors: true,
    baseURL: baseUrl,
  });
}
