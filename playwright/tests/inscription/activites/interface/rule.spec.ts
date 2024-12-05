import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';
import { ProgramInterfaceErrorTest } from '../../parts/program-interface-error';

test.describe('Rule', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('ThirdPartyProgramInterface:RuleActivity');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Rule');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Error', async () => {
    await runTest(view, ProgramInterfaceErrorTest);
  });
});
