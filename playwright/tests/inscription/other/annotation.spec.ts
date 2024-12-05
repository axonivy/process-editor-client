import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../glsp-protocol';
import { createProcess } from '../../glsp-protocol';
import { GeneralTestWithoutTags } from '../parts/name';
import { runTest } from '../parts/part-tester';

test.describe('Annotation', () => {
  let view: Inscription;
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
