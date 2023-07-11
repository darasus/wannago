import {defineConfig} from '@playwright/test';

export default defineConfig({
  expect: {
    timeout: process.env.VERCEL_ENV === 'development' ? 10 * 1000 : undefined,
  },
  use: {
    actionTimeout:
      process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
    navigationTimeout:
      process.env.VERCEL_ENV === 'development' ? 20 * 1000 : undefined,
    ignoreHTTPSErrors: true,
  },
});
