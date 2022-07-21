import { expect, Page, test } from '@playwright/test';
import { assertPosition, assertPositionIsNot, getCtrl, getPosition, startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test.describe('key listener - undo redo', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
  });

  test('move node', async ({ page, browserName }) => {
    const start = page.locator(startSelector);
    const startPos = await getPosition(start);

    await start.click();
    await start.dragTo(page.locator('.sprotty-graph'));
    await assertPositionIsNot(start, startPos);

    await undo(page, browserName);
    await assertPosition(start, startPos);

    await redo(page, browserName);
    await assertPositionIsNot(start, startPos);
  });

  test('delete node', async ({ page, browserName }) => {
    const start = page.locator(startSelector);
    await start.click();

    await page.keyboard.press('Delete');
    await expect(start).toBeHidden();

    await undo(page, browserName);
    await expect(start).toBeVisible();

    await redo(page, browserName);
    await expect(start).toBeHidden();
  });
});

async function undo(page: Page, browserName: string): Promise<void> {
  await page.keyboard.press(`${getCtrl(browserName)}+Z`);
}

async function redo(page: Page, browserName: string): Promise<void> {
  let redoKey = 'Y';
  if (browserName === 'webkit') {
    redoKey = 'Shift+Z';
  }
  await page.keyboard.press(`${getCtrl(browserName)}+${redoKey}`);
}
