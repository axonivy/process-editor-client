import { test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/InscriptionView';
import { EndPageTestEmptyWarning, GeneralTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('End Page', () => {
  let testee: CreateProcessResult;
  let view: InscriptionView;

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
    await runTest(view, EndPageTestEmptyWarning);
  });
});
