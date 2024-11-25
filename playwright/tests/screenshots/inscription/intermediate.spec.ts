import { test } from '@playwright/test';
import { screenshotAccordion } from './screenshot-util';

const INTERMEDIATE_PID = {
  WAIT: '16C70B87DCB65433-f0'
} as const;

test.describe('Wait Program', () => {
  test('Event Tab', async ({ page }) => {
    await screenshotAccordion(page, INTERMEDIATE_PID.WAIT, 'Event', 'wait-intermediate-event-tab-event.png');
  });

  test('Configuration Tab', async ({ page }) => {
    await screenshotAccordion(page, INTERMEDIATE_PID.WAIT, 'Configuration', 'wait-intermediate-event-tab-configuration.png');
  });

  test('Task Tab', async ({ page }) => {
    await screenshotAccordion(page, INTERMEDIATE_PID.WAIT, 'Task', 'wait-intermediate-event-tab-task.png');
  });
});
