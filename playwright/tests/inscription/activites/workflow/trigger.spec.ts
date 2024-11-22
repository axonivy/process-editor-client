import { test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/InscriptionView';
import { GeneralTest, TriggerCallTest, runTest, OutputTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Trigger', () => {
  let view: InscriptionView;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('TriggerCall');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Trigger');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Trigger', async () => {
    await runTest(view, TriggerCallTest);
  });

  test('Output', async () => {
    await runTest(view, OutputTest);
  });
});
