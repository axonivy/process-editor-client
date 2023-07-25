import { devices, PlaywrightTestConfig } from '@playwright/test';

let config: PlaywrightTestConfig = {
  use: {
    headless: false,
    browserName: 'chromium'
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
    reporter: [['./webtests/custom-reporter.ts'], ['junit', { outputFile: 'report.xml' }]],
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
