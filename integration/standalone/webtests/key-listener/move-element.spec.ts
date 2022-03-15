import { expect, test } from '@playwright/test';
import { randomTestProcessUrl } from '../process-editor-url-util';
import { resetSelection, addPool, multiSelect, checkBoundingBoxPosition } from '../diagram-util';
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
    await expect(start).toBeVisible();
    await expect(end).toBeVisible();
    await resetSelection(page);
    const startBox = await start.boundingBox();
    const endBox = await end.boundingBox();

    await multiSelect(page, [start, end], browserName);
    await page.keyboard.press('ArrowUp', delay);
    await page.keyboard.press('ArrowLeft', delay);
    await resetSelection(page);
    checkBoundingBoxPosition(await start.boundingBox(), { x: startBox.x - 8, y: startBox.y - 8 });
    checkBoundingBoxPosition(await end.boundingBox(), { x: endBox.x - 8, y: endBox.y - 8 });

    await multiSelect(page, [start, end], browserName);
    await page.keyboard.press('ArrowDown', delay);
    await page.keyboard.press('ArrowRight', delay);
    await resetSelection(page);
    checkBoundingBoxPosition(await start.boundingBox(), { x: startBox.x, y: startBox.y });
    checkBoundingBoxPosition(await end.boundingBox(), { x: endBox.x, y: endBox.y });
  });

  test('move pool and lane', async ({ page, browserName }) => {
    const start = page.locator('.sprotty-graph .start');
    const pool = page.locator('.sprotty-graph .pool');
    const lane = page.locator('.sprotty-graph .pool .lane');
    await addPool(page, 60);
    await pool.click();
    await clickQuickActionStartsWith(page, 'Create Lane');
    await expect(start).toBeVisible();
    await expect(pool).toBeVisible();
    await expect(lane).toBeVisible();
    await resetSelection(page);
    const startBox = await start.boundingBox();
    const poolBox = await pool.boundingBox();
    const laneBox = await lane.boundingBox();

    await multiSelect(page, [pool, lane], browserName, clickPosition);
    await page.keyboard.press('ArrowDown', delay);
    await page.keyboard.press('ArrowLeft', delay);
    await resetSelection(page);
    checkBoundingBoxPosition(await start.boundingBox(), { x: startBox.x, y: startBox.y });
    checkBoundingBoxPosition(await pool.boundingBox(), { x: poolBox.x, y: poolBox.y + 8 });
    checkBoundingBoxPosition(await lane.boundingBox(), { x: laneBox.x, y: laneBox.y + 8 });

    await multiSelect(page, [pool, lane], browserName, clickPosition);
    await page.keyboard.press('ArrowUp', delay);
    await page.keyboard.press('ArrowRight', delay);
    await resetSelection(page);
    checkBoundingBoxPosition(await start.boundingBox(), { x: startBox.x, y: startBox.y });
    checkBoundingBoxPosition(await pool.boundingBox(), { x: poolBox.x, y: poolBox.y });
    checkBoundingBoxPosition(await lane.boundingBox(), { x: laneBox.x, y: laneBox.y });

    await multiSelect(page, [lane], browserName, clickPosition);
    await page.keyboard.press('ArrowDown', delay);
    await page.keyboard.press('ArrowLeft', delay);
    await resetSelection(page);
    checkBoundingBoxPosition(await start.boundingBox(), { x: startBox.x, y: startBox.y });
    checkBoundingBoxPosition(await pool.boundingBox(), { x: poolBox.x, y: poolBox.y });
    checkBoundingBoxPosition(await lane.boundingBox(), { x: laneBox.x, y: laneBox.y + 8 });
  });
});
