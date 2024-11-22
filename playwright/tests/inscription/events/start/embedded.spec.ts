import { test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/InscriptionView';
import { GeneralTestWithoutTags, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Embedded Start', () => {
  let view: InscriptionView;
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
