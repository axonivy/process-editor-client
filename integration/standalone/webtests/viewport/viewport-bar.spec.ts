import { test, expect, Page } from '@playwright/test';
import { getCtrl } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test.describe('viewport bar', () => {
  const ORIGIN_VIEWPORT = 'scale(1) translate(0,50)';

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await assertGraphTransform(page, ORIGIN_VIEWPORT);
  });

  test('origin', async ({ page }) => {
    const originBtn = page.locator('#originBtn');
    await expect(originBtn).toBeVisible();

    await originBtn.click();
    await assertGraphTransform(page, ORIGIN_VIEWPORT);

    await page.mouse.move(10, 80);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    await page.mouse.wheel(100, 100);
    await assertGraphNotOriginViewport(page);

    await originBtn.click();
    await assertGraphTransform(page, ORIGIN_VIEWPORT);
  });

  test('center', async ({ page }) => {
    const centerBtn = page.locator('#centerBtn');
    await expect(centerBtn).toBeVisible();

    await centerBtn.click();
    await assertGraphNotOriginViewport(page);
    await assertGraphTransform(page, /scale\(1\) translate\(\d*\.?\d*,\d*\.?\d*\)/);
  });

  test('fit to screen', async ({ page }) => {
    const fitToScreenBtn = page.locator('#fitToScreenBtn');
    await expect(fitToScreenBtn).toBeVisible();

    await fitToScreenBtn.click();
    await assertGraphNotOriginViewport(page);
    await assertGraphTransform(page, /scale\(\d*\.?\d*\) translate\(-?\d*\.?\d*,-?\d*\.?\d*\)/);
  });

  test('zoom level', async ({ page, browserName }) => {
    const zoomLevel = page.locator('.ivy-viewport-bar label');
    expect(zoomLevel).toHaveText('100%');

    await page.mouse.move(10, 80);
    await page.mouse.wheel(0, 100);
    expect(zoomLevel).toHaveText('100%');

    await scrollAndAssert(page, browserName, 100, /^\d{2}%$/);
    await scrollAndAssert(page, browserName, -200, /^\d{3}%$/);

    const originBtn = page.locator('#originBtn');
    await originBtn.click();
    await expect(zoomLevel).toHaveText('100%');
  });

  async function scrollAndAssert(page: Page, browserName: string, wheelDelta: number, expectedZoomLevel: RegExp): Promise<void> {
    const zoomLevel = page.locator('.ivy-viewport-bar label');
    await page.keyboard.down(getCtrl(browserName));
    await page.mouse.wheel(0, wheelDelta);
    await expect(zoomLevel).not.toHaveText('100%');
    await expect(zoomLevel).toHaveText(expectedZoomLevel);
    await page.keyboard.up(getCtrl(browserName));
  }

  async function assertGraphTransform(page: Page, expected: string | RegExp): Promise<void> {
    const graph = page.locator('.sprotty-graph > g');
    await expect(graph).toHaveAttribute('transform', expected);
  }

  async function assertGraphNotOriginViewport(page: Page): Promise<void> {
    const graph = page.locator('.sprotty-graph > g');
    await expect(graph).not.toHaveAttribute('transform', ORIGIN_VIEWPORT);
  }
});
