import { expect, Locator, Page, test } from '@playwright/test';
import { addActivity, multiSelect } from '../diagram-util';
import { randomTestProcessUrl } from '../process-editor-url-util';
import { clickQuickAction, clickQuickActionEndsWith, clickQuickActionStartsWith, editLabel, assertQuickActionsCount } from './quick-actions-util';

test.describe('quick actions - nodes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(randomTestProcessUrl());
  });

  test('event actions', async ({ page }) => {
    const start = page.locator('.sprotty-graph .start');
    const end = page.locator('.sprotty-graph .end');

    await assertQuickActionsCount(page, 0);
    await start.click();
    await assertQuickActionsCount(page, 4);
    await end.click();
    await assertQuickActionsCount(page, 3);
  });

  test('label edit', async ({ page }) => {
    const start = page.locator('.sprotty-graph .start');
    await expect(start.locator('.sprotty-label div')).toHaveText('start.ivp');
    await editNodeLabel(page, start);
  });

  test('delete', async ({ page }) => {
    const start = page.locator('.sprotty-graph .start');
    await deleteNode(page, start);
    await expect(start).not.toBeVisible();
  });

  test('attach comment', async ({ page }) => {
    const end = page.locator('.sprotty-graph .end');
    const comment = page.locator('.sprotty-graph .comment');
    const connectors = page.locator('.sprotty-graph > g > .sprotty-edge');
    await expect(comment).not.toBeVisible();
    await expect(connectors).toHaveCount(1);

    await end.dragTo(page.locator('.sprotty-graph'));
    await end.click();
    await clickQuickActionEndsWith(page, 'Comment');
    await expect(comment).toBeVisible();
    await expect(connectors).toHaveCount(2);
  });

  test('connect', async ({ page }) => {
    const start = page.locator('.sprotty-graph .start');
    const end = page.locator('.sprotty-graph .end');
    const connector = page.locator('.sprotty-graph > g > .sprotty-edge:not(.feedback-edge)');
    const connectorFeedback = page.locator('.sprotty-graph > g > .sprotty-edge.feedback-edge');
    await connector.click();
    await page.keyboard.press('Delete');

    await start.click();
    await clickQuickAction(page, 'Connect');
    await expect(connectorFeedback).toBeVisible();
    await expect(connector).not.toBeVisible();

    await end.click();
    await expect(connectorFeedback).not.toBeVisible();
    await expect(connector).toBeVisible();
  });

  test('error boundary', async ({ page }) => {
    addActivity(page, 'User Dialog', 200, 200);
    const hd = page.locator('.sprotty-graph .hd');
    const errorBoundary = page.locator('.sprotty-graph .boundary\\:error');
    await expect(errorBoundary).toBeHidden();

    await hd.click();
    await clickQuickActionEndsWith(page, 'Error');
    await expect(errorBoundary).toBeVisible();
  });

  test('signal boundary', async ({ page }) => {
    addActivity(page, 'User Task', 200, 200);
    const userTask = page.locator('.sprotty-graph .user');
    const signalBoundary = page.locator('.sprotty-graph .boundary\\:signal');
    await expect(signalBoundary).toBeHidden();

    await userTask.click();
    await clickQuickActionEndsWith(page, 'Signal');
    await expect(signalBoundary).toBeVisible();
  });

  test('auto align', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Webkit browser has problems with Ctrl multiselect');
    const start = page.locator('.sprotty-graph .start');
    const end = page.locator('.sprotty-graph .end');
    await end.dragTo(page.locator('.sprotty-graph'));
    const startTransform = await start.getAttribute('transform');
    const endTransform = await end.getAttribute('transform');

    await multiSelect(page, [start, end]);
    await clickQuickActionEndsWith(page, 'Align (A)');
    await expect(start).toHaveAttribute('transform', startTransform);
    await expect(end).not.toHaveAttribute('transform', endTransform);
    // end element should only be moved vertically
    await expect(end).toHaveAttribute('transform', /translate\(625, \d+\)/);
  });

  test('wrap, jump and unwrap', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Webkit browser has problems with Ctrl multiselect');
    const jumpOutBtn = page.locator('.dynamic-tools i[title^="Jump"]');
    const start = page.locator('.sprotty-graph .start');
    const end = page.locator('.sprotty-graph .end');
    const embedded = page.locator('.sprotty-graph .embeddedproc');

    await multiSelect(page, [start, end]);
    await clickQuickActionStartsWith(page, 'Wrap');
    await expect(start).toBeHidden();
    await expect(end).toBeHidden();
    await expect(embedded).toBeVisible();

    await embedded.click();
    await clickQuickAction(page, 'Jump (J)');
    await expect(start).toBeVisible();
    await expect(end).toBeVisible();
    await expect(embedded).toBeHidden();
    await expect(jumpOutBtn).toBeVisible();

    await jumpOutBtn.click();
    await expect(start).toBeHidden();
    await expect(end).toBeHidden();
    await expect(embedded).toBeVisible();

    await embedded.click();
    await clickQuickActionStartsWith(page, 'Unwrap');
    await expect(start).toBeVisible();
    await expect(end).toBeVisible();
    await expect(embedded).toBeHidden();
  });

  async function editNodeLabel(page: Page, node: Locator): Promise<void> {
    editLabel(page, node);
    await expect(node.locator('.sprotty-label div')).toHaveText('test label');
  }

  async function deleteNode(page: Page, node: Locator): Promise<void> {
    await node.click();
    await clickQuickAction(page, 'Delete');
  }
});
