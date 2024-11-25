import { test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/InscriptionView';
import { GeneralTest, SubCallTest, runTest, OutputTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Call Sub', () => {
  let view: InscriptionView;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('SubProcessCall');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Call');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('SubCall', async () => {
    await runTest(view, SubCallTest);
  });

  test('Output', async () => {
    await runTest(view, OutputTest);
  });
});
