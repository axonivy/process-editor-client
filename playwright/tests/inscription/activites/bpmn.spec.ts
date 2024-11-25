import { test } from '@playwright/test';
import { GeneralTestWithoutTags, runTest } from '../parts';
import { InscriptionView } from '../../page-objects/inscription/InscriptionView';
import { createProcess } from '../../glsp-protocol';

test.describe('BPMN Activities', () => {
  test('Generic', async ({ page }) => {
    const testee = await createProcess('GenericBpmnElement');
    const view = await InscriptionView.selectElement(page, testee.elementId);
    await view.expectHeaderText('Generic');
    await runTest(view, GeneralTestWithoutTags);
  });

  test('User', async ({ page }) => {
    const testee = await createProcess('UserBpmnElement');
    const view = await InscriptionView.selectElement(page, testee.elementId);
    await view.expectHeaderText('User');
  });

  test('Manual', async ({ page }) => {
    const testee = await createProcess('ManualBpmnElement');
    const view = await InscriptionView.selectElement(page, testee.elementId);
    await view.expectHeaderText('Manual');
  });

  test('Script', async ({ page }) => {
    const testee = await createProcess('ScriptBpmnElement');
    const view = await InscriptionView.selectElement(page, testee.elementId);
    await view.expectHeaderText('Script');
  });

  test('Service', async ({ page }) => {
    const testee = await createProcess('ServiceBpmnElement');
    const view = await InscriptionView.selectElement(page, testee.elementId);
    await view.expectHeaderText('Service');
  });

  test('Rule', async ({ page }) => {
    const testee = await createProcess('RuleBpmnElement');
    const view = await InscriptionView.selectElement(page, testee.elementId);
    await view.expectHeaderText('Rule');
  });

  test('Receive', async ({ page }) => {
    const testee = await createProcess('ReceiveBpmnElement');
    const view = await InscriptionView.selectElement(page, testee.elementId);
    await view.expectHeaderText('Receive');
  });

  test('Send', async ({ page }) => {
    const testee = await createProcess('SendBpmnElement');
    const view = await InscriptionView.selectElement(page, testee.elementId);
    await view.expectHeaderText('Send');
  });
});
