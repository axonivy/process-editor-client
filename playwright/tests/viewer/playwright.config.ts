import { defineConfig } from '@playwright/test';
import defaultConfig from '../../playwright.base';

export default defineConfig(defaultConfig, {
  testDir: './',
  webServer: {
    command: 'yarn --cwd ../.. start:viewer',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
});
