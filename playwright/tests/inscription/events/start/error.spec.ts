import { test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/InscriptionView';
import { ErrorCatchTest, GeneralTest, OutputTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Error Start', () => {
  let view: InscriptionView;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('ErrorStartEvent');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Error Start');
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
