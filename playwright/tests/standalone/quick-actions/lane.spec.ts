import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';
import { cmdCtrl } from '../../page-objects/test-helper';

test.describe('quick actions - lanes', () => {
  test('root lane actions', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const lane = await processEditor.createLane({ x: 10, y: 60 });
    await lane.quickActionBar().count(0);
    await lane.select();
    await lane.quickActionBar().count(3);
  });

  test('root lane label', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const lane = await processEditor.createLane({ x: 10, y: 60 });
    const labelEdit = await lane.quickActionBar().editLabel();
    await labelEdit.edit('Test label', cmdCtrl());
    await lane.expectLabel('Test label');
  });

  test('root lane delete', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const lane = await processEditor.createLane({ x: 10, y: 60 });
    await lane.quickActionBar().trigger('Delete');
    await expect(lane.locator()).not.toBeVisible();
  });

  test('pool actions', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const pool = await processEditor.createPool({ x: 10, y: 60 });
    await pool.quickActionBar().count(0);
    await pool.select();
    await pool.quickActionBar().count(4);
  });

  test('pool label', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const pool = await processEditor.createPool({ x: 10, y: 60 });
    const processName = page.url().substring(page.url().lastIndexOf('/') + 1, page.url().lastIndexOf('.'));
    await pool.expectLabel(processName);

    const labelEdit = await pool.quickActionBar().editLabel();
    await labelEdit.edit('Test label', cmdCtrl());
    await pool.expectLabel('Test label');
  });

  test('pool delete', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const pool = await processEditor.createPool({ x: 10, y: 60 });
    await pool.quickActionBar().trigger('Delete');
    await expect(pool.locator()).not.toBeVisible();
  });

  test('pool add and remove embedded lanes', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const pool = await processEditor.createPool({ x: 10, y: 60 });
    const lane1 = await pool.createEmbeddedLane();
    await pool.expectEmbeddedLanes(1);
    await pool.createEmbeddedLane();
    await pool.expectEmbeddedLanes(2);

    await lane1.quickActionBar().trigger('Delete');
    await pool.expectEmbeddedLanes(1);
    await pool.quickActionBar().trigger('Delete');
    await expect(pool.locator()).not.toBeVisible();
  });
});
