import { expect, test } from '@playwright/test';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { resetSelection, multiSelect, assertPosition, getPosition, startSelector, endSelector } from '../diagram-util';
import { clickQuickActionStartsWith } from '../quick-actions/quick-actions-util';
import { addPool } from '../toolbar-util';
import { ORIGIN_VIEWPORT, assertGraphTransform } from '../viewport/viewport-util';

test.describe('key listener - move elements with arrow keys', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
  });

  test('move selected nodes', async ({ page, browserName }) => {
    const start = page.locator(startSelector);
    const end = page.locator(endSelector);
    const startPos = await getPosition(start);
    const endPos = await getPosition(end);

    await multiSelect(page, [start, end], browserName);
    await page.keyboard.press('ArrowUp');
    await assertPosition(start, { x: startPos.x, y: startPos.y - 8 });
    await assertPosition(end, { x: endPos.x, y: endPos.y - 8 });

    await page.keyboard.press('ArrowLeft');
    await assertPosition(start, { x: startPos.x - 8, y: startPos.y - 8 });
    await assertPosition(end, { x: endPos.x - 8, y: endPos.y - 8 });

    await page.keyboard.press('ArrowDown');
    await assertPosition(start, { x: startPos.x - 8, y: startPos.y });
    await assertPosition(end, { x: endPos.x - 8, y: endPos.y });

    await page.keyboard.press('ArrowRight');
    await assertPosition(start, { x: startPos.x, y: startPos.y });
    await assertPosition(end, { x: endPos.x, y: endPos.y });
  });

  test('move pool and lane', async ({ page, browserName }) => {
    const start = page.locator(startSelector);
    const pool = page.locator('.sprotty-graph .pool');
    const lane = page.locator('.sprotty-graph .pool .lane');
    await addPool(page, 60);
    await pool.click();
    await clickQuickActionStartsWith(page, 'Create');
    await resetSelection(page);
    const startPos = await getPosition(start);
    const poolPos = await getPosition(pool);
    const lanePos = await getPosition(lane);

    await multiSelect(page, [pool, lane], browserName, { x: 10, y: 10 });
    await page.keyboard.press('ArrowDown');
    await assertPosition(start, { x: startPos.x, y: startPos.y });
    await assertPosition(pool, { x: poolPos.x, y: poolPos.y + 8 });
    await assertPosition(lane, { x: lanePos.x, y: lanePos.y });

    await page.keyboard.press('ArrowUp');
    await assertPosition(start, { x: startPos.x, y: startPos.y });
    await assertPosition(pool, { x: poolPos.x, y: poolPos.y });
    await assertPosition(lane, { x: lanePos.x, y: lanePos.y });

    await resetSelection(page);
    await lane.click();
    await expect(lane).toHaveClass(/selected/);
    await page.keyboard.press('ArrowDown');
    await assertPosition(start, { x: startPos.x, y: startPos.y });
    await assertPosition(pool, { x: poolPos.x, y: poolPos.y });
    await assertPosition(lane, { x: lanePos.x, y: lanePos.y + 8 });
  });

  test('move graph', async ({ page }) => {
    await resetSelection(page);
    await new Promise(resolve => setTimeout(resolve, 500)); // sleep 500ms
    await assertGraphTransform(page, ORIGIN_VIEWPORT);

    await page.keyboard.press('ArrowUp');
    await assertGraphTransform(page, 'scale(1) translate(0,60)');

    await page.keyboard.press('ArrowDown');
    await assertGraphTransform(page, 'scale(1) translate(0,52)');

    await page.keyboard.press('ArrowLeft');
    await assertGraphTransform(page, 'scale(1) translate(8,52)');

    await page.keyboard.press('ArrowRight');
    await assertGraphTransform(page, 'scale(1) translate(0,52)');
  });
});
