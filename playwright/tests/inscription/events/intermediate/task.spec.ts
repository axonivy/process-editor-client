import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { CaseTest, EndPageTest, GeneralTest, OutputTest, TaskTester, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Task', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('TaskSwitchEvent', { additionalElements: ['ErrorStartEvent'] });
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Task');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Output', async () => {
    await runTest(view, OutputTest);
  });

  test('Task', async () => {
    await runTest(view, new TaskTester({ error: new RegExp(testee.processId) }));
  });

  test('Case', async () => {
    await runTest(view, CaseTest);
  });

  test('EndPage', async () => {
    await runTest(view, EndPageTest);
  });
});
