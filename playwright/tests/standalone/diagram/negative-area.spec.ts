import { Page, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';

const setupNegativProcess = async (page: Page) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const area = processEditor.negativeArea();
  await page.mouse.move(10, 80);
  await page.mouse.wheel(-10, -10);
  await area.expectHidden();
  return { processEditor, area };
};

test('new element', async ({ page }) => {
  const { processEditor, area } = await setupNegativProcess(page);
  const toolbar = processEditor.toolbar();
  await toolbar.triggerCreateElement('activities', 'User Dialog');
  await page.mouse.move(100, 100);
  await area.expectVisible();
  await processEditor.clickAt({ x: 100, y: 100 });
  await processEditor.element('dialogCall').expectSelected();
  await area.expectHidden();
});

test('move element', async ({ page }) => {
  const { processEditor, area } = await setupNegativProcess(page);
  await processEditor.startElement.select();
  await area.expectHidden();
  await page.mouse.down();
  await page.mouse.move(300, 300);
  await area.expectVisible();
  await page.mouse.up();
  await area.expectHidden();
});
