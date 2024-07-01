import { defineConfig, devices } from '@playwright/test';
import defaultConfig from '../../playwright.base';

export default defineConfig(defaultConfig, {
  testDir: './',
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev:standalone',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
});
