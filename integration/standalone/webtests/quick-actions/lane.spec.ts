import { expect, Locator, Page, test } from '@playwright/test';
import { addLane, addPool } from '../toolbar-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { assertQuickActionsCount, clickQuickAction, clickQuickActionStartsWith, editLabel } from './quick-actions-util';

test.describe('quick actions - lanes', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
  });

  test('root lane actions', async ({ page }) => {
    const lane = page.locator('.sprotty-graph .lane');
    await addLane(page, 60);

    await assertQuickActionsCount(page, 0);
    await lane.click();
    await assertQuickActionsCount(page, 3);
  });

  test('root lane label', async ({ page }) => {
    const lane = page.locator('.sprotty-graph .lane');
    await addLane(page, 60);
    await editLaneLabel(page, lane);
  });

  test('root lane delete', async ({ page }) => {
    const lane = page.locator('.sprotty-graph .lane');
    await addLane(page, 60);

    await deleteLane(page, lane);
    await expect(lane).not.toBeVisible();
  });

  test('pool actions', async ({ page }) => {
    const pool = page.locator('.sprotty-graph .pool');
    await addPool(page, 60);

    await assertQuickActionsCount(page, 0);
    await pool.click();
    await assertQuickActionsCount(page, 4);
  });

  test('pool label', async ({ page }) => {
    const processName = page.url().substring(page.url().lastIndexOf('/') + 1, page.url().lastIndexOf('.'));
    const pool = page.locator('.sprotty-graph .pool');
    await addPool(page, 60);
    await expect(pool.locator('text tspan')).toHaveText(processName);
    await editLaneLabel(page, pool);
  });

  test('pool delete', async ({ page }) => {
    const pool = page.locator('.sprotty-graph .pool');
    await addPool(page, 60);
    await deleteLane(page, pool);
    await expect(pool).not.toBeVisible();
  });

  test('pool add and remove embedded lanes', async ({ page }) => {
    const pool = page.locator('.sprotty-graph .pool');
    const embeddedLanes = page.locator('.sprotty-graph .pool > .lane');
    await addPool(page, 60);

    await createEmbeddedLane(page, pool);
    await expect(embeddedLanes).toHaveCount(1);

    await createEmbeddedLane(page, pool);
    await expect(embeddedLanes).toHaveCount(2);

    await deleteLane(page, embeddedLanes.first());
    await expect(embeddedLanes).toHaveCount(1);

    await deleteLane(page, pool);
    await expect(embeddedLanes).toHaveCount(0);
    await expect(pool).not.toBeVisible();
  });

  async function createEmbeddedLane(page: Page, pool: Locator): Promise<void> {
    await pool.click({ position: { x: 5, y: 100 } });
    await clickQuickActionStartsWith(page, 'Create');
  }

  async function deleteLane(page: Page, lane: Locator): Promise<void> {
    await lane.click({ position: { x: 5, y: 100 } });
    await clickQuickAction(page, 'Delete');
  }

  async function editLaneLabel(page: Page, lane: Locator): Promise<void> {
    await editLabel(page, lane);
    await expect(lane.locator('text tspan')).toHaveText('test label');
  }
});
