import { defineConfig } from '@playwright/test';
import defaultConfig from '../../playwright.base';

export default defineConfig(defaultConfig, {
  testDir: './',
  webServer: {
    command: 'npm run dev:standalone',
    url: process.env.CI ? 'http://localhost:4173' : 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
});
