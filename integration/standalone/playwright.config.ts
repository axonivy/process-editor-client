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
      video: 'retain-on-failure',
      trace: 'retain-on-failure'
    },
    retries: 1,
    reporter: 'junit',
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
