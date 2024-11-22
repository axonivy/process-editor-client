import { test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/InscriptionView';
import { DialogCallTest, GeneralTest, runTest, OutputTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Dialog Call', () => {
  let view: InscriptionView;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('DialogCall');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('User Dialog');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('DialogCall', async () => {
    await runTest(view, DialogCallTest);
  });

  test('Output', async () => {
    await runTest(view, OutputTest);
  });
});
