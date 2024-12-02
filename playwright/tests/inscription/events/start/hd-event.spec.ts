import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { GeneralTest, OutputTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Event Start', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('HtmlDialogEventStart');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Event Start');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Output', async () => {
    await runTest(view, OutputTest);
  });
});
