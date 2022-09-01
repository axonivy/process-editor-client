import { test, expect, Page } from '@playwright/test';
import { assertPosition, resetSelection, startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { addActivity, addLane } from '../toolbar-util';

test.describe('quick actions - color', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
  });

  test('open process editor', async ({ page }) => {
    const toolPalette = page.locator('#sprotty_ivy-tool-bar');
    await expect(toolPalette).toBeVisible();
    await expect(page.locator(startSelector)).toBeVisible();
  });

  test('element move', async ({ page }) => {
    const start = page.locator(startSelector);
    await expect(start).toBeVisible();
    await assertPosition(start, { x: 81, y: 49 });
    await start.click();
    await assertNegativeArea(page, false);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await assertNegativeArea(page, true);
    await page.mouse.up();
    await assertPosition(start, { x: 185, y: 129 });
    await assertNegativeArea(page, false);
  });

  test('element resize handles', async ({ page }) => {
    await addActivity(page, 'User Dialog', 300, 200);
    const hd = page.locator('.dialogCall');
    await expect(hd).toBeVisible();

    await resetSelection(page);
    const resizeHandles = page.locator('.sprotty-resize-handle');
    await expect(resizeHandles).toHaveCount(0);
    await hd.click();
    await expect(resizeHandles).toHaveCount(4);

    const hdRect = hd.locator('> rect');
    await expect(hdRect).toHaveAttribute('width', '112');
    await expect(hdRect).toHaveAttribute('height', '60');
  });

  test('lane handles', async ({ page }) => {
    await addLane(page, 100);
    const lane = page.locator('.lane');
    await expect(lane).toBeVisible();

    const resizeHandles = page.locator('.lane-resize-handle');
    await expect(resizeHandles).toHaveCount(0);
    await lane.click();
    await expect(resizeHandles).toHaveCount(2);
  });

  async function assertNegativeArea(page: Page, visible: boolean): Promise<void> {
    const negativeArea = page.locator('.negative-area');
    if (visible) {
      await expect(negativeArea).toHaveCount(2);
    } else {
      await expect(negativeArea).toBeHidden();
    }
  }
});
