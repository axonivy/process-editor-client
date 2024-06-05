import { test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';

test.describe('Diagram - Negative Area', () => {
  test('new element', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const area = processEditor.negativeArea();
    const toolbar = processEditor.toolbar();
    await area.expectHidden();
    await toolbar.triggerCreateElement('activities', 'User Dialog');
    await page.mouse.move(100, 100);
    await area.expectVisible();
    await processEditor.clickAt({ x: 100, y: 100 });
    await processEditor.element('dialogCall').expectSelected();
    await area.expectHidden();
  });

  test('move element', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const area = processEditor.negativeArea();
    await processEditor.startElement.select();
    await area.expectHidden();
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await area.expectVisible();
    await page.mouse.up();
    await area.expectHidden();
  });
});
