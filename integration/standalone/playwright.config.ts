import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    trace: 'on-first-retry'
  },
  retries: 1
};

export default config;
