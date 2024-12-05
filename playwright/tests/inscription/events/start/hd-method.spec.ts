import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';
import { MethodResultTest } from '../../parts/result';
import { MethodStartTest } from '../../parts/start';

test.describe('Method Start', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('HtmlDialogMethodStart');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Method Start');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Start', async () => {
    await runTest(view, MethodStartTest);
  });

  test('Result', async () => {
    await runTest(view, MethodResultTest);
  });
});
