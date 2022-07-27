import { test, expect, Page } from '@playwright/test';
import { resetSelection, startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test.describe('marquee tool', () => {
  const MARQUEE_TOOL = '#btn_marquee_tools';
  const MARQUEE_MODE = '.marquee-mode';

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await expect(page.locator('.ivy-tool-bar')).toBeVisible();
    await expect(page.locator(startSelector)).toBeVisible();
    await expect(page.locator(MARQUEE_MODE)).toBeHidden();
  });

  test('tool bar button', async ({ page }) => {
    await page.locator(MARQUEE_TOOL).click();
    await markAndAssert(page);
    await page.mouse.up();
    await assertAfterRelease(page);
  });

  test('shift key', async ({ page }) => {
    await resetSelection(page);
    await page.keyboard.down('Shift');
    await markAndAssert(page);
    await page.keyboard.up('Shift');
    await assertAfterRelease(page);
  });

  async function markAndAssert(page: Page): Promise<void> {
    await expect(page.locator(MARQUEE_MODE)).toBeVisible();
    await page.mouse.move(10, 50);
    await page.mouse.down();
    await page.mouse.move(400, 200);
    await expect(page.locator('g.selected')).toHaveCount(3);
    await expect(page.locator('.quick-actions-bar')).toBeHidden();
  }

  async function assertAfterRelease(page: Page): Promise<void> {
    await expect(page.locator(MARQUEE_MODE)).toBeHidden();
    await expect(page.locator('.quick-actions-bar')).toBeVisible();
  }
});
