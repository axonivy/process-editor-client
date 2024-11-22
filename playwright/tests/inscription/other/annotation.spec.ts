import { test } from '@playwright/test';
import { InscriptionView } from '../../page-objects/inscription/InscriptionView';
import { GeneralTestWithoutTags, runTest } from '../parts';
import type { CreateProcessResult } from '../../glsp-protocol';
import { createProcess } from '../../glsp-protocol';

test.describe('Annotation', () => {
  let view: InscriptionView;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('ProcessAnnotation');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Note');
  });

  test('General', async () => {
    await runTest(view, GeneralTestWithoutTags);
  });
});
