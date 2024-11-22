import { test } from '@playwright/test';
import { screenshotAccordion, screenshotSection } from './screenshot-util';

const GENERIC_PID = {
  SCRIPT: '168F0C6DF682858E-f3',
  USER_TASK: '168F0C6DF682858E-f5',
  USER_TASK2: '167C7307A5664620-f17',
  USER_TASK3: '167C7307A5664620-f22',
  WS_CALL: '160DF556A2226E66-f3',
  SUB_START: '16A7DD0A1D330578-f0'
} as const;

test.describe('Common', () => {
  test('General', async ({ page }) => {
    await screenshotAccordion(page, GENERIC_PID.SCRIPT, 'General', 'common-tab-general.png');
  });

  test('Output', async ({ page }) => {
    await screenshotAccordion(page, GENERIC_PID.USER_TASK, 'Output', 'common-tab-output.png');
  });

  test('Code', async ({ page }) => {
    await screenshotSection(page, GENERIC_PID.SCRIPT, 'Output', 'Code', 'common-tab-code.png');
  });

  test('Start', async ({ page }) => {
    await screenshotAccordion(page, GENERIC_PID.SUB_START, 'Start', 'common-tab-start.png');
  });

  test('Result', async ({ page }) => {
    await screenshotAccordion(page, GENERIC_PID.SUB_START, 'Result', 'common-tab-result.png');
  });

  test('Data Cache', async ({ page }) => {
    await screenshotAccordion(page, GENERIC_PID.WS_CALL, 'Cache', 'common-tab-data-cache.png');
  });

  test('Case', async ({ page }) => {
    await screenshotAccordion(page, GENERIC_PID.USER_TASK, 'Case', 'common-tab-case.png');
  });

  test('Task', async ({ page }) => {
    await screenshotAccordion(page, GENERIC_PID.USER_TASK, 'Task', 'common-tab-task.png');
  });

  test('Task Options', async ({ page }) => {
    await screenshotSection(page, GENERIC_PID.USER_TASK3, 'Task', 'Options', 'common-section-task-options.png');
  });

  test('Task Expiry', async ({ page }) => {
    await screenshotSection(page, GENERIC_PID.USER_TASK2, 'Task', 'Expiry', 'common-section-task-expiry.png');
  });

  test('Custom Fields', async ({ page }) => {
    await screenshotSection(page, GENERIC_PID.USER_TASK2, 'Task', 'Custom Fields', 'common-section-task-custom-fields.png');
  });

  test('Task Notification', async ({ page }) => {
    await screenshotSection(page, GENERIC_PID.USER_TASK2, 'Task', 'Notification', 'common-section-task-notification.png');
  });

  test('Task Code', async ({ page }) => {
    await screenshotSection(page, GENERIC_PID.USER_TASK2, 'Task', 'Code', 'common-section-task-code.png');
  });

  test('Call', async ({ page }) => {
    await screenshotAccordion(page, GENERIC_PID.USER_TASK, 'Dialog', 'common-tab-call.png');
  });
});
