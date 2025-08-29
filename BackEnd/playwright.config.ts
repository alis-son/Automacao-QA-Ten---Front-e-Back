import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 10000,
  reporter: [
    ['html', { outputFolder: 'reports', open: 'never' }]
  ],
  use: {
    baseURL: 'https://serverest.dev',
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    },
    headless: false
  }
});