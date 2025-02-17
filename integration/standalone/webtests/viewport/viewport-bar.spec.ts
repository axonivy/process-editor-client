import { test, expect, type Page } from '@playwright/test';
import { getCtrl } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import {
  assertGraphNotOriginViewport,
  assertGraphOriginViewport,
  assertGraphTransform,
  assertGridNotOriginSize,
  assertGridOriginPosition,
  assertGridPosition
} from './viewport-util';

test.describe('viewport bar', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await assertGraphOriginViewport(page);
  });

  test('origin', async ({ page }) => {
    const originBtn = page.locator('#originBtn');
    await expect(originBtn).toBeVisible();

    await originBtn.click();
    await assertGraphOriginViewport(page);

    await page.mouse.move(10, 80);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    await page.mouse.wheel(100, 100);
    await assertGraphNotOriginViewport(page);

    await originBtn.click();
    await assertGraphOriginViewport(page);
    await assertGridOriginPosition(page);
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
    await assertZoom(page);

    await page.mouse.move(10, 80);
    await page.mouse.wheel(0, 100);
    await assertZoom(page);
    await assertGridPosition(page, { x: 0, y: -100 });

    await zoomAndAssert(page, browserName, 100, /^\d{2}%$/);
    await zoomAndAssert(page, browserName, -200, /^\d{3}%$/);

    const originBtn = page.locator('#originBtn');
    await originBtn.click();
    await assertZoom(page);
    await assertGridOriginPosition(page);
  });

  async function zoomAndAssert(page: Page, browserName: string, wheelDelta: number, expectedZoomLevel: RegExp): Promise<void> {
    await page.keyboard.down(getCtrl(browserName));
    await page.mouse.wheel(0, wheelDelta);
    await page.keyboard.up(getCtrl(browserName));
    await assertZoom(page, expectedZoomLevel);
    await assertGridNotOriginSize(page);
  }

  async function assertZoom(page: Page, expectedZoomLevel?: RegExp): Promise<void> {
    const zoomLevel = page.locator('.ivy-viewport-bar label');
    if (expectedZoomLevel) {
      await expect(zoomLevel).not.toHaveText('100%');
      await expect(zoomLevel).toHaveText(expectedZoomLevel);
    } else {
      await expect(zoomLevel).toHaveText('100%');
    }
  }
});
