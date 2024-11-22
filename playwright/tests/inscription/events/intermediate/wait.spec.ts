import { test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/InscriptionView';
import { GeneralTest, OutputTest, TaskTester, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { EventTest } from '../../parts/event';
import { ConfigFileIntermediateEventBeanTest } from '../../parts/configuration';

test.describe('Wait', () => {
  let view: InscriptionView;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('WaitEvent', { additionalElements: ['ErrorStartEvent'] });
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Wait');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Event', async () => {
    await runTest(view, EventTest);
  });

  test('Configuration FileIntermediateBean', async () => {
    const start = view.accordion('Event');
    await start.toggle();
    await start.section('Java Class').open();
    await start.combobox().choose('ch.ivyteam.ivy.process.intermediateevent.beans.FileIntermediateEventBean');

    await runTest(view, ConfigFileIntermediateEventBeanTest);
  });

  test('Output', async () => {
    await runTest(view, OutputTest);
  });

  test('Task', async () => {
    await runTest(
      view,
      new TaskTester({
        error: new RegExp(testee.processId),
        testOptions: { responsible: false, priority: false, expiry: false, options: undefined }
      })
    );
  });
});
