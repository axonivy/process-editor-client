import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { DialogCallTest } from '../../parts/call';
import { CaseTest } from '../../parts/case';
import { GeneralTest } from '../../parts/name';
import { OutputTest } from '../../parts/output';
import { runTest } from '../../parts/part-tester';
import { TaskTester } from '../../parts/task';

test.describe('User Task', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('UserTask', { additionalElements: ['ErrorStartEvent'] });
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('User Task');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Task', async () => {
    await runTest(view, new TaskTester({ error: new RegExp(testee.processId) }));
  });

  test('Case', async () => {
    await runTest(view, CaseTest);
  });

  test('DialogCall', async () => {
    await runTest(view, DialogCallTest);
  });

  test('Output', async () => {
    await runTest(view, OutputTest);
  });
});
