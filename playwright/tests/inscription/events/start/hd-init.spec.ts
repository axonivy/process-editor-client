import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { GeneralTest, ResultTest, StartTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Init Start', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('HtmlDialogStart');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Init Start');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Start', async () => {
    await runTest(view, StartTest);
  });

  test('Result', async () => {
    await runTest(view, ResultTest);
  });
});
