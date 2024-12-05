import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { ErrorCatchTest } from '../../parts/error-catch';
import { GeneralTest } from '../../parts/name';
import { OutputTest } from '../../parts/output';
import { runTest } from '../../parts/part-tester';

test.describe('Error Start', () => {
  let view: Inscription;
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
