import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { GeneralTestWithoutTags } from '../../parts/name';
import { runTest } from '../../parts/part-tester';

test.describe('Embedded Start', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('EmbeddedProcessElement');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, `${testee.elementId}-g0`);
  });

  test('Header', async () => {
    await view.expectHeaderText('Embedded Start');
  });

  test('General', async () => {
    await runTest(view, GeneralTestWithoutTags);
  });
});
