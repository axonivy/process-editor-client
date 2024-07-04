import { devices, defineConfig } from '@playwright/test';

const browsers = () => {
  const chrome = { name: 'chromium', use: { ...devices['Desktop Chrome'] } };
  const firefox = { name: 'firefox', use: { ...devices['Desktop Firefox'] } };
  const webkit = { name: 'webkit', use: { ...devices['Desktop Safari'] } };
  switch (process.env.BROWSERS) {
    case 'chrome':
      return [chrome];
    case 'firefox':
      return [firefox];
    case 'webkit':
      return [webkit];
    default:
      return [chrome, firefox, webkit];
  }
};

export default defineConfig({
  testDir: './tests',
  timeout: 1000 * (process.env.CI ? 60 : 30),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['../custom-reporter.ts'], ['junit', { outputFile: 'report.xml' }], ['list']] : 'html',
  use: {
    actionTimeout: 0,
    baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:3000',
    trace: 'retain-on-failure',
    headless: process.env.CI ? true : false
  },
  projects: browsers()
});
