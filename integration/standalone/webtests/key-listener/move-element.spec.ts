import { test } from '@playwright/test';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { resetSelection, addPool, multiSelect, assertPosition, getPosition, startSelector, endSelector } from '../diagram-util';
import { clickQuickActionStartsWith } from '../quick-actions/quick-actions-util';

const delay = { delay: 100 };
const clickPosition = { x: 1, y: 1 };

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
    await page.keyboard.press('ArrowUp', delay);
    await page.keyboard.press('ArrowLeft', delay);
    await resetSelection(page);
    await assertPosition(start, { x: startPos.x - 8, y: startPos.y - 8 });
    await assertPosition(end, { x: endPos.x - 8, y: endPos.y - 8 });

    await multiSelect(page, [start, end], browserName);
    await page.keyboard.press('ArrowDown', delay);
    await page.keyboard.press('ArrowRight', delay);
    await resetSelection(page);
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

    await multiSelect(page, [pool, lane], browserName, clickPosition);
    await page.keyboard.press('ArrowDown', delay);
    await page.keyboard.press('ArrowLeft', delay);
    await resetSelection(page);
    await assertPosition(start, { x: startPos.x, y: startPos.y });
    await assertPosition(pool, { x: poolPos.x, y: poolPos.y + 8 });
    await assertPosition(lane, { x: lanePos.x, y: lanePos.y });

    await multiSelect(page, [pool, lane], browserName, clickPosition);
    await page.keyboard.press('ArrowUp', delay);
    await page.keyboard.press('ArrowRight', delay);
    await resetSelection(page);
    await assertPosition(start, { x: startPos.x, y: startPos.y });
    await assertPosition(pool, { x: poolPos.x, y: poolPos.y });
    await assertPosition(lane, { x: lanePos.x, y: lanePos.y });

    await multiSelect(page, [lane], browserName, clickPosition);
    await page.keyboard.press('ArrowDown', delay);
    await page.keyboard.press('ArrowLeft', delay);
    await resetSelection(page);
    await assertPosition(start, { x: startPos.x, y: startPos.y });
    await assertPosition(pool, { x: poolPos.x, y: poolPos.y });
    await assertPosition(lane, { x: lanePos.x, y: lanePos.y + 8 });
  });
});
