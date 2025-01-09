import { test } from '@playwright/test';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { DialogCallTest } from '../../parts/call';
import { GeneralTest } from '../../parts/name';
import { OutputTest } from '../../parts/output';
import { runTest } from '../../parts/part-tester';

test.describe('Dialog Call', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('DialogCall');
  });

  test.beforeEach(async ({ page }) => {
    view = await openElementInscription(page, testee.elementId);
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
