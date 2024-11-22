import { test } from '@playwright/test';
import { screenshotAccordion } from './screenshot-util';

const END_PID = {
  PAGE: '16BADA40155E7401-f1',
  ERROR: '16BBC1007C5F8F69-f2'
} as const;

test.describe('Process End Page', () => {
  test('End Page Tab', async ({ page }) => {
    await screenshotAccordion(page, END_PID.PAGE, 'End Page', 'process-end-page-tab-end-page.png');
  });
});

test.describe('Error End', () => {
  test('Error Tab', async ({ page }) => {
    await screenshotAccordion(page, END_PID.ERROR, 'Error', 'error-end-event-tab-error.png');
  });
});
