import { devices, PlaywrightTestConfig } from '@playwright/test';

let config: PlaywrightTestConfig = {
  testDir: './webtests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:3000',
    headless: process.env.CI ? true : false
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'yarn start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
};

if (process.env.CI) {
  config = {
    use: {
      screenshot: 'only-on-failure',
      video: 'on-first-retry',
      trace: 'on-first-retry'
    },
    retries: 1,
    reporter: [['./webtests/custom-reporter.ts'], ['junit', { outputFile: 'report.xml' }], ['list']],
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] }
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] }
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] }
      }
    ]
  };
}

export default config;
