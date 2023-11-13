import { test, Page } from '@playwright/test';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { assertGraphOriginViewport, assertGraphTransform, assertGridPosition, ORIGIN_VIEWPORT } from './viewport-util';

test.describe('viewport bar', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await assertGraphOriginViewport(page);
    await page.mouse.move(10, 80);
  });

  test('scroll vertical', async ({ page }) => {
    await scrollAndAssert(page, { x: 0, y: 100 }, 'scale(1) translate(0,-52)', { x: 0, y: -100 });
    await scrollAndAssert(page, { x: 0, y: -200 }, 'scale(1) translate(0,148)', { x: 0, y: 100 });
    await scrollAndAssert(page, { x: 0, y: 100 }, ORIGIN_VIEWPORT, { x: 0, y: 0 });
  });

  test('scroll horizontal', async ({ page }) => {
    await scrollAndAssert(page, { x: 100, y: 0 }, 'scale(1) translate(-100,48)', { x: -100, y: 0 });
    await scrollAndAssert(page, { x: -200, y: 0 }, 'scale(1) translate(100,48)', { x: 100, y: 0 });
    await scrollAndAssert(page, { x: 100, y: 0 }, ORIGIN_VIEWPORT, { x: 0, y: 0 });
  });

  test('scroll horizontal (shift)', async ({ page }) => {
    await page.keyboard.down('Shift');
    await scrollAndAssert(page, { x: 0, y: 100 }, 'scale(1) translate(-100,48)', { x: -100, y: 0 });
    await scrollAndAssert(page, { x: 0, y: -200 }, 'scale(1) translate(100,48)', { x: 100, y: 0 });
    await scrollAndAssert(page, { x: 0, y: 100 }, ORIGIN_VIEWPORT, { x: 0, y: 0 });
    await page.keyboard.up('Shift');
  });

  async function scrollAndAssert(page: Page, scrollDelta: { x: number; y: number }, expected: string | RegExp, expectedGridMove: { x: number; y: number }): Promise<void> {
    await page.mouse.wheel(scrollDelta.x, scrollDelta.y);
    await assertGraphTransform(page, expected);
    await assertGridPosition(page, expectedGridMove);
  }
});
