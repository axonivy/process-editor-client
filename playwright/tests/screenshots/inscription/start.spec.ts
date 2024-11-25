import { test } from '@playwright/test';
import { screenshotAccordion } from './screenshot-util';

const START_PID = {
  START: '1562D1CBAC49CCF8-f0',
  SIGNAL: '16BBC3FED3A47640-f47',
  PROGRAM: '16C70B87DCB65433-f1',
  ERROR: '16BBC1007C5F8F69-f3',
  WS: '167C6BD0817F2889-ws0'
} as const;

test.describe('Request Start', () => {
  test('Request Tab', async ({ page }) => {
    await screenshotAccordion(page, START_PID.START, 'Request', 'request-start-tab-request.png');
  });

  test('Trigger Tab', async ({ page }) => {
    await screenshotAccordion(page, START_PID.START, 'Trigger', 'request-start-tab-trigger.png');
  });

  test('Task Tab', async ({ page }) => {
    await screenshotAccordion(page, START_PID.START, 'Task', 'request-start-tab-task.png');
  });
});

test.describe('Signal Start', () => {
  test('Signal Tab', async ({ page }) => {
    await screenshotAccordion(page, START_PID.SIGNAL, 'Signal', 'signal-start-event-tab-signal.png');
  });
});

test.describe('Program Start', () => {
  test('Start Tab', async ({ page }) => {
    await screenshotAccordion(page, START_PID.PROGRAM, 'Java Bean', 'program-start-tab-start.png');
  });

  test('Editor Tab', async ({ page }) => {
    await screenshotAccordion(page, START_PID.PROGRAM, 'Configuration', 'program-start-tab-configuration.png');
  });
});

test.describe('Error Start', () => {
  test('Error Tab', async ({ page }) => {
    await screenshotAccordion(page, START_PID.ERROR, 'Error', 'error-start-event-tab-error.png');
  });
});

test.describe('Web Service Process Start', () => {
  test('Web Service Tab', async ({ page }) => {
    await screenshotAccordion(page, START_PID.WS, 'Web Service', 'web-service-process-start-tab-webservice.png');
  });

  test('Task Tab', async ({ page }) => {
    await screenshotAccordion(page, START_PID.WS, 'Task', 'web-service-process-start-tab-task.png');
  });
});
