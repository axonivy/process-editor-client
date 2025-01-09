import { test } from '@playwright/test';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { CaseTest } from '../../parts/case';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';
import { RequestTest } from '../../parts/request';
import { StartTest } from '../../parts/start';
import { TaskTester } from '../../parts/task';
import { TriggerTest } from '../../parts/trigger';

test.describe('StartRequest', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('RequestStart', { additionalElements: ['ErrorStartEvent'] });
  });

  test.beforeEach(async ({ page }) => {
    view = await openElementInscription(page, testee.elementId);
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
