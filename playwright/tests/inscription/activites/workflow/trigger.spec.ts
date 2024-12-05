import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { GeneralTest } from '../../parts/name';
import { TriggerCallTest } from '../../parts/call';
import { OutputTest } from '../../parts/output';
import { runTest } from '../../parts/part-tester';

test.describe('Trigger', () => {
  let view: Inscription;
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
