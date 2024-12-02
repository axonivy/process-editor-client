import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { ErrorCatchTest, GeneralTest, OutputTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Error', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('UserTask', { boundaryType: 'error' });
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Error Boundary');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('ErrorCatch', async () => {
    await runTest(view, ErrorCatchTest);
  });

  test('Output', async () => {
    await runTest(view, OutputTest);
  });
});
