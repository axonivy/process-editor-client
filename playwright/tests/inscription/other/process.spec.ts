import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../glsp-protocol';
import { createProcess } from '../../glsp-protocol';
import { GeneralTestWithDisabledName } from '../parts/name';
import { runTest } from '../parts/part-tester';
import { PermissionsTest } from '../parts/permissions';
import { ProcessDataTest } from '../parts/process-data';

test.describe('Business Process', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('Database');
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

  test('Process Data', async () => {
    await runTest(view, ProcessDataTest);
  });

  test('Permissions', async () => {
    await runTest(view, PermissionsTest());
  });
});
