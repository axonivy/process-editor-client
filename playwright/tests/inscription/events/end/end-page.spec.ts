import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { EndPageTest } from '../../parts/end-page';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';

test.describe('End Page', () => {
  let testee: CreateProcessResult;
  let view: Inscription;

  test.beforeAll(async () => {
    testee = await createProcess('TaskEndPage', { location: { x: 200, y: 200 } });
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('End Page');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('EndPage', async () => {
    await runTest(view, EndPageTest);
  });
});
