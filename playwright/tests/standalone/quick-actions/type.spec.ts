import { test, expect } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';
import { cmdCtrl } from '../../page-objects/test-helper';

test.describe('quick actions - change BPMN type', () => {
  test('switch type', async ({ page, browserName }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.startElement;
    const end = processEditor.endElement;
    const embedded = processEditor.element('embeddedProcessElement');
    const user = processEditor.element('userBpmnElement');

    await processEditor.multiSelect([start, end], cmdCtrl(browserName));
    await processEditor.quickAction().trigger('Wrap', 'startsWith');

    await expect(embedded.locator()).toBeVisible();
    await expect(user.locator()).toBeHidden();

    await embedded.quickActionBar().changeType('User');
    await expect(user.locator()).toBeVisible();
    await expect(embedded.locator()).toBeHidden();

    await user.quickActionBar().changeType('Sub');
    await expect(embedded.locator()).toBeVisible();
    await expect(user.locator()).toBeHidden();
  });
});
