import { test, expect, Page } from '@playwright/test';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test.describe('viewport bar', () => {
  const ORIGIN_VIEWPORT = 'scale(1) translate(0,50)';

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    const graph = page.locator('.sprotty-graph > g');
    await expect(graph).toHaveAttribute('transform', ORIGIN_VIEWPORT);
    await page.mouse.move(10, 80);
  });

  test('scroll vertical', async ({ page }) => {
    await scrollAndAssert(page, 100, 'scale(1) translate(0,-50)');
    await scrollAndAssert(page, -200, 'scale(1) translate(0,150)');
    await scrollAndAssert(page, 100, ORIGIN_VIEWPORT);
  });

  test('scroll horizontal', async ({ page }) => {
    await page.keyboard.down('Shift');
    await scrollAndAssert(page, 100, 'scale(1) translate(-100,50)');
    await scrollAndAssert(page, -200, 'scale(1) translate(100,50)');
    await scrollAndAssert(page, 100, ORIGIN_VIEWPORT);
    await page.keyboard.up('Shift');
  });

  async function scrollAndAssert(page: Page, scrollDelta: number, expected: string | RegExp): Promise<void> {
    const graph = page.locator('.sprotty-graph > g');
    await page.mouse.wheel(scrollDelta, scrollDelta);
    await expect(graph).toHaveAttribute('transform', expected);
  }
});
