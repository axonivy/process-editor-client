import { test } from '@playwright/test';
import { randomTestProcessUrl } from '../process-editor-url-util';
import { resetSelection, addPool, multiSelect, assertPosition, getBounds } from '../diagram-util';
import { clickQuickActionStartsWith } from '../quick-actions/quick-actions-util';

const delay = { delay: 100 };
const clickPosition = { x: 1, y: 1 };

test.describe('arrow key shortcut', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(randomTestProcessUrl());
  });

  test('move selected nodes', async ({ page, browserName }) => {
    const start = page.locator('.sprotty-graph .start');
    const end = page.locator('.sprotty-graph .end');
    await resetSelection(page);
    const startBox = await getBounds(start);
    const endBox = await getBounds(end);

    await multiSelect(page, [start, end], browserName);
    await page.keyboard.press('ArrowUp', delay);
    await page.keyboard.press('ArrowLeft', delay);
    await resetSelection(page);
    assertPosition(start, { x: startBox.x - 8, y: startBox.y - 8 });
    assertPosition(end, { x: endBox.x - 8, y: endBox.y - 8 });

    await multiSelect(page, [start, end], browserName);
    await page.keyboard.press('ArrowDown', delay);
    await page.keyboard.press('ArrowRight', delay);
    await resetSelection(page);
    assertPosition(start, { x: startBox.x, y: startBox.y });
    assertPosition(end, { x: endBox.x, y: endBox.y });
  });

  test('move pool and lane', async ({ page, browserName }) => {
    const start = page.locator('.sprotty-graph .start');
    const pool = page.locator('.sprotty-graph .pool');
    const lane = page.locator('.sprotty-graph .pool .lane');
    await addPool(page, 60);
    await pool.click();
    await clickQuickActionStartsWith(page, 'Create Lane');
    await resetSelection(page);
    const startBox = await getBounds(start);
    const poolBox = await getBounds(pool);
    const laneBox = await getBounds(lane);

    await multiSelect(page, [pool, lane], browserName, clickPosition);
    await page.keyboard.press('ArrowDown', delay);
    await page.keyboard.press('ArrowLeft', delay);
    await resetSelection(page);
    assertPosition(start, { x: startBox.x, y: startBox.y });
    assertPosition(pool, { x: poolBox.x, y: poolBox.y + 8 });
    assertPosition(lane, { x: laneBox.x, y: laneBox.y + 8 });

    await multiSelect(page, [pool, lane], browserName, clickPosition);
    await page.keyboard.press('ArrowUp', delay);
    await page.keyboard.press('ArrowRight', delay);
    await resetSelection(page);
    assertPosition(start, { x: startBox.x, y: startBox.y });
    assertPosition(pool, { x: poolBox.x, y: poolBox.y });
    assertPosition(lane, { x: laneBox.x, y: laneBox.y });

    await multiSelect(page, [lane], browserName, clickPosition);
    await page.keyboard.press('ArrowDown', delay);
    await page.keyboard.press('ArrowLeft', delay);
    await resetSelection(page);
    assertPosition(start, { x: startBox.x, y: startBox.y });
    assertPosition(pool, { x: poolBox.x, y: poolBox.y });
    assertPosition(lane, { x: laneBox.x, y: laneBox.y + 8 });
  });
});
