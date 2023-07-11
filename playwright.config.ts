import {defineConfig} from '@playwright/test';
import {baseUrl} from './__checks__/constants';

export default defineConfig({
  expect: {
    timeout: process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
  },
  use: {
    actionTimeout:
      process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
    navigationTimeout:
      process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
    ignoreHTTPSErrors: true,
    baseURL: baseUrl,
  },
});
