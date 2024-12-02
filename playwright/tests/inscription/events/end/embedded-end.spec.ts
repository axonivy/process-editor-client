import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { GeneralTestWithoutTags, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Embedded End', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('EmbeddedProcessElement');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, `${testee.elementId}-g1`);
  });

  test('Header', async () => {
    await view.expectHeaderText('Embedded End');
  });

  test('General', async () => {
    await runTest(view, GeneralTestWithoutTags);
  });
});
