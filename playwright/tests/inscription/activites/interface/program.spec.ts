import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { GeneralTest, ProgramInterfaceErrorTest, ProgramInterfaceStartTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Program', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('ProgramInterface');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Program');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Java Bean', async () => {
    await runTest(view, ProgramInterfaceStartTest);
  });

  test('Error', async () => {
    await runTest(view, ProgramInterfaceErrorTest);
  });
});
