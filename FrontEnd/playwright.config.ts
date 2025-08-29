import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './Page_Objects/Tests',
  timeout: 30 * 1000,
  retries: 1,
  reporter: [['html', { outputFolder: 'reports', open: 'never' }]],
  use: {
    baseURL: 'https://front.serverest.dev',
    headless: true,
    screenshot: 'on',
    video: 'on',
  },
});