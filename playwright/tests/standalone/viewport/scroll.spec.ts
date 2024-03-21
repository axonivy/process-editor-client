import { test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';
import { ORIGIN_VIEWPORT, ViewportBar } from '../../page-objects/viewport';

test.describe('viewport bar', () => {
  let viewport: ViewportBar;

  test.beforeEach(async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    viewport = processEditor.viewport();
    await viewport.expectGraphOriginViewport();
    await page.mouse.move(10, 80);
  });

  test('scroll vertical', async ({ page }) => {
    await page.mouse.wheel(0, 100);
    await expectScroll('scale(1) translate(0,-100)', { x: 0, y: -100 });

    await page.mouse.wheel(0, -200);
    await expectScroll('scale(1) translate(0,100)', { x: 0, y: 100 });

    await page.mouse.wheel(0, 100);
    await expectScroll(ORIGIN_VIEWPORT, { x: 0, y: 0 });
  });

  test('scroll horizontal', async ({ page }) => {
    await page.mouse.wheel(100, 0);
    await expectScroll('scale(1) translate(-100,0)', { x: -100, y: 0 });

    await page.mouse.wheel(-200, 0);
    await expectScroll('scale(1) translate(100,0)', { x: 100, y: 0 });

    await page.mouse.wheel(100, 0);
    await expectScroll(ORIGIN_VIEWPORT, { x: 0, y: 0 });
  });

  test('scroll horizontal (shift)', async ({ page }) => {
    await page.keyboard.down('Shift');
    await page.mouse.wheel(0, 100);
    await expectScroll('scale(1) translate(-100,0)', { x: -100, y: 0 });

    await page.mouse.wheel(0, -200);
    await expectScroll('scale(1) translate(100,0)', { x: 100, y: 0 });

    await page.mouse.wheel(0, 100);
    await expectScroll(ORIGIN_VIEWPORT, { x: 0, y: 0 });
    await page.keyboard.up('Shift');
  });

  async function expectScroll(expectedTransform: string | RegExp, expectedGridPosition: { x: number; y: number }) {
    await viewport.expectGraphTransform(expectedTransform);
    await viewport.expectGridPosition(expectedGridPosition);
  }
});
