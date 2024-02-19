import { expect, Page, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';
import { cmdCtrl, isMac } from '../../page-objects/test-helper';

test.describe('key listener - undo redo', () => {
  test('move node', async ({ page, browserName }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.startElement;
    const startPos = await start.getPosition();

    await start.select();
    await start.move({ x: 300, y: 300 });
    await start.expectPositionIsNot(startPos);

    await undo(page, browserName);
    await start.expectPosition(startPos);

    await redo(page, browserName);
    await start.expectPositionIsNot(startPos);
  });

  test('delete node', async ({ page, browserName }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.startElement;
    await start.select();

    await page.keyboard.press('Delete');
    await expect(start.locator()).toBeHidden();

    await undo(page, browserName);
    await expect(start.locator()).toBeVisible();

    await redo(page, browserName);
    await expect(start.locator()).toBeHidden();
  });
});

async function undo(page: Page, browserName: string): Promise<void> {
  await page.keyboard.press(`${cmdCtrl(browserName)}+Z`);
}

async function redo(page: Page, browserName: string): Promise<void> {
  let redoKey = 'Y';
  if (browserName === 'webkit' || isMac()) {
    redoKey = 'Shift+Z';
  }
  await page.keyboard.press(`${cmdCtrl(browserName)}+${redoKey}`);
}
