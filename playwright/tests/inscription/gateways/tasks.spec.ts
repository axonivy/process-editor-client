import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../page-objects/inscription/inscription-view';
import { CaseTest, EndPageTest, GeneralTest, OutputTest, TasksTester, runTest } from '../parts';
import type { CreateProcessResult } from '../../glsp-protocol';
import { createProcess } from '../../glsp-protocol';

test.describe('Tasks', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('TaskSwitchGateway', { connectTo: ['Script'], additionalElements: ['ErrorStartEvent'] });
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Tasks');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Output', async () => {
    await runTest(view, OutputTest);
  });

  test('Tasks', async () => {
    await runTest(view, new TasksTester(new RegExp(testee.processId)));
  });

  test('Case', async () => {
    await runTest(view, CaseTest);
  });

  test('EndPage', async () => {
    await runTest(view, EndPageTest);
  });
});
