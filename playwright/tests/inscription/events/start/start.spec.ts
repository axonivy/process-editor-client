import { test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/InscriptionView';
import { CaseTest, GeneralTest, RequestTest, StartTest, TaskTester, TriggerTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('StartRequest', () => {
  let view: InscriptionView;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('RequestStart', { additionalElements: ['ErrorStartEvent'] });
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Start');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Start', async () => {
    await runTest(view, StartTest);
  });

  test('Request', async () => {
    await runTest(view, RequestTest);
  });

  test('Trigger', async () => {
    await runTest(view, TriggerTest);
  });

  test('Task', async () => {
    const request = view.accordion('Request');
    await request.toggle();
    const permissions = request.section('Permission');
    await permissions.toggle();
    await permissions.checkbox('Anonymous').click();

    await runTest(
      view,
      new TaskTester({
        error: new RegExp(testee.processId),
        testOptions: { responsible: false, priority: true, expiry: true, options: 'persist' }
      })
    );
  });

  test('Case', async () => {
    await runTest(view, CaseTest);
  });
});
