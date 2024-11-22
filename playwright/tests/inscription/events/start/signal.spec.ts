import { test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/InscriptionView';
import { GeneralTest, SignalCatchTest, SignalOutputTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Signal Start', () => {
  let view: InscriptionView;
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
