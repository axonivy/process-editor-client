import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../page-objects/inscription/inscription-view';
import { GeneralTestWithDisabledName, PermissionsTest, runTest } from '../parts';
import type { CreateProcessResult } from '../../glsp-protocol';
import { createProcess } from '../../glsp-protocol';

test.describe('HTML Dialog Process', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('Database', { processKind: 'HTML_DIALOG' });
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.processId);
  });

  test('Header', async () => {
    await view.expectHeaderText(testee.processUUID);
  });

  test('General', async () => {
    await runTest(view, GeneralTestWithDisabledName);
  });

  test('Permissions', async () => {
    await runTest(view, PermissionsTest(false));
  });
});
