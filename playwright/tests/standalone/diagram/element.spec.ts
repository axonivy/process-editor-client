import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';

test.describe('diagram', () => {
  test('element resize handles', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const element = await processEditor.createActivity('User Dialog', { x: 300, y: 200 });
    await processEditor.resetSelection();
    await element.expectResizeHandles(0);
    await element.select();
    await element.expectResizeHandles(4);
  });

  test('helper lines', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    await processEditor.endElement.select();
    await expect(page.locator('.helper-line')).toHaveCount(0);
    await page.mouse.down();
    await expect(page.locator('.helper-line')).toHaveCount(3);
    await page.mouse.up();
    await expect(page.locator('.helper-line')).toHaveCount(0);
  });

  test('lane handles', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const lane = await processEditor.createLane({ x: 10, y: 100 });
    await lane.expectResizeHandles(0);
    await lane.select();
    await lane.expectResizeHandles(2);
  });
});
