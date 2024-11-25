import { test } from '@playwright/test';
import { screenshotAccordion } from './screenshot-util';

const PROCESS_PID = '1562D1CBAC49CCF8' as const;

test.describe('Business Process', () => {
  test('Process Data', async ({ page }) => {
    await screenshotAccordion(page, PROCESS_PID, 'Process Data', 'process-tab-process-data.png');
  });

  test('Permissions', async ({ page }) => {
    await screenshotAccordion(page, PROCESS_PID, 'Permissions', 'process-tab-permissions.png');
  });
});
