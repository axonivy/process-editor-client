import { test } from '@playwright/test';
import { screenshotAccordion } from './screenshot-util';

const END_PID = {
  ERROR: '16BBC1007C5F8F69-f1',
  SIGNAL: '16BBC3FED3A47640-f1'
} as const;

test.describe('Error Boundary', () => {
  test('Error Tab', async ({ page }) => {
    await screenshotAccordion(page, END_PID.ERROR, 'Error', 'error-boundary-event-tab-error.png');
  });
});

test.describe('Signal Boundary', () => {
  test('Signal Tab', async ({ page }) => {
    await screenshotAccordion(page, END_PID.SIGNAL, 'Signal', 'signal-boundary-event-tab-signal.png');
  });
});
