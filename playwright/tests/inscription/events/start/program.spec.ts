import { test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/InscriptionView';
import { GeneralTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { ProgramStartTest } from '../../parts/program-start';
import { ConfigTimerBeanTest, ConfigFilePickupStartEventBeanTest } from '../../parts/configuration';

test.describe('Program Start', () => {
  let view: InscriptionView;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('ProgramStart');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Program Start');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Java Bean', async () => {
    await runTest(view, ProgramStartTest);
  });

  test('Configuration FilePickupBean', async () => {
    const start = view.accordion('Java Bean');
    await start.toggle();
    await start.section('Java Class').open();
    await start.combobox().choose('ch.ivyteam.ivy.process.eventstart.beans.FilePickupStartEventBean');

    await runTest(view, ConfigFilePickupStartEventBeanTest);
  });

  test('Configuration TimerBean', async () => {
    const start = view.accordion('Java Bean');
    await start.toggle();
    await start.section('Java Class').open();
    await start.combobox().choose('ch.ivyteam.ivy.process.eventstart.beans.TimerBean');
    await runTest(view, ConfigTimerBeanTest);
  });
});
