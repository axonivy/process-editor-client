import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { BoundarySignalCatchTest, GeneralTest, OutputTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Signal', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('UserTask', { boundaryType: 'signal' });
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Signal Boundary');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('SignalCatch', async () => {
    await runTest(view, BoundarySignalCatchTest);
  });

  test('Output', async () => {
    await runTest(view, OutputTest);
  });
});
