import { test } from '@playwright/test';
import { screenshotAccordion } from './screenshot-util';

const GATEWAY_PID = {
  ALTERNATIVE: '16B9DA1B2A591E8C-f2',
  TASKS: '167C7307A5664620-f9'
} as const;

test.describe('Alternative', () => {
  test('Condition Tab', async ({ page }) => {
    await screenshotAccordion(page, GATEWAY_PID.ALTERNATIVE, 'Condition', 'alternative-tab-condition.png');
  });
});

test.describe('Task Switch Gateway', () => {
  test('Tasks Tab', async ({ page }) => {
    await screenshotAccordion(page, GATEWAY_PID.TASKS, 'Tasks', 'task-switch-gateway-tab-task.png');
  });
});
