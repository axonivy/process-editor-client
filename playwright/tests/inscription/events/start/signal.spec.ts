import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { GeneralTest } from '../../parts/name';
import { SignalOutputTest } from '../../parts/output';
import { runTest } from '../../parts/part-tester';
import { SignalCatchTest } from '../../parts/signal-catch';

test.describe('Signal Start', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('SignalStartEvent');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Signal Start');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('SignalCatch', async () => {
    await runTest(view, SignalCatchTest);
  });

  test('Output', async () => {
    await runTest(view, SignalOutputTest);
  });
});
