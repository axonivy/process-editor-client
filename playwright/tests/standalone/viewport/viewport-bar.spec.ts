import { test, Page } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';
import { cmdCtrl } from '../../page-objects/test-helper';

test.describe('viewport bar', () => {
  test('origin', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const viewport = processEditor.viewport();
    await viewport.triggerOrigin();
    await viewport.expectGraphOriginViewport();

    await page.mouse.move(10, 80);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    await page.mouse.wheel(100, 100);
    await viewport.expectGraphNotOriginViewport();

    await viewport.triggerOrigin();
    await viewport.expectGraphOriginViewport();
    await viewport.expectGridOriginPosition();
  });

  test('center', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const viewport = processEditor.viewport();
    await viewport.triggerCenter();
    await viewport.expectGraphNotOriginViewport();
    await viewport.expectGraphTransform(/scale\(1\) translate\(\d*\.?\d*,\d*\.?\d*\)/);
  });

  test('fit to screen', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const viewport = processEditor.viewport();
    await viewport.triggerFitToScreen();
    await viewport.expectGraphNotOriginViewport();
    await viewport.expectGraphTransform(/scale\(\d*\.?\d*\) translate\(-?\d*\.?\d*,-?\d*\.?\d*\)/);
  });

  test('zoom level', async ({ page, browserName }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const viewport = processEditor.viewport();
    await viewport.expectZoomLevel('100%');

    await page.mouse.move(10, 80);
    await page.mouse.wheel(0, 100);
    await viewport.expectZoomLevel('100%');
    await viewport.expectGridPosition({ x: 0, y: -100 });

    await zoom(page, browserName, 100);
    await viewport.expectZoomLevel(/^\d{2}%$/);
    await zoom(page, browserName, -200);
    await viewport.expectZoomLevel(/^\d{3}%$/);
    await viewport.expectGridNotOriginSize();

    await viewport.triggerOrigin();
    await viewport.expectZoomLevel('100%');
    await viewport.expectGridOriginPosition();
  });

  async function zoom(page: Page, browserName: string, wheelDelta: number) {
    await page.keyboard.down(cmdCtrl(browserName));
    await page.mouse.wheel(0, wheelDelta);
    await page.keyboard.up(cmdCtrl(browserName));
  }
});
