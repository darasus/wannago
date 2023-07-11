import {defineConfig} from '@playwright/test';

export default defineConfig({
  expect: {
    timeout: process.env.VERCEL_ENV === 'development' ? 10 * 1000 : undefined,
  },
});
