import { expect, Locator, Page, test } from '@playwright/test';
import { embeddedSelector, endSelector, multiSelect, removeElement, startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { clickQuickAction, clickQuickActionStartsWith, editLabel, assertQuickActionsCount } from './quick-actions-util';

test.describe('quick actions - nodes', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
  });

  test('event actions', async ({ page }) => {
    const start = page.locator(startSelector);
    const end = page.locator(endSelector);

    await assertQuickActionsCount(page, 0);
    await start.click();
    await assertQuickActionsCount(page, 7);
    await end.click();
    await assertQuickActionsCount(page, 4);

    await removeElement(page, endSelector);
    await start.click();
    await assertQuickActionsCount(page, 8);
  });

  test('label edit', async ({ page }) => {
    const start = page.locator(startSelector);
    await expect(start.locator('.sprotty-label div')).toHaveText('start');
    await editNodeLabel(page, start);
  });

  test('delete', async ({ page }) => {
    const start = page.locator(startSelector);
    await deleteNode(page, start);
    await expect(start).not.toBeVisible();
  });

  test('info', async ({ page }) => {
    await assertInformation(page, startSelector, 'start');
    await assertInformation(page, endSelector);
    await assertInformation(page, '.sprotty-graph > g > .sprotty-edge');
  });

  test('info outerElement', async ({ page }) => {
    const start = page.locator(startSelector);
    const embeddedProcessElement = page.locator('.sprotty-graph .embeddedProcessElement');
    const embeddedStart = page.locator('.sprotty-graph .start\\:embeddedStart');
    await start.click();
    await page.keyboard.press('A');
    await page.keyboard.type('sub');
    await page.keyboard.press('Enter');
    await expect(embeddedProcessElement).toBeVisible();
    await page.keyboard.press('J');
    await expect(embeddedStart).toBeVisible();
    await embeddedStart.click();
    await page.keyboard.press('I');
    await expect(page.locator('.bar-menu-text')).toContainText('[start]');
  });

  test('connect', async ({ page }) => {
    const start = page.locator(startSelector);
    const end = page.locator(endSelector);
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

  test('auto align', async ({ page, browserName }) => {
    const start = page.locator(startSelector);
    const end = page.locator(endSelector);

    await expect(end).toBeVisible();
    const startPos = await start.getAttribute('transform');
    const endPos = await end.getAttribute('transform');
    await end.dragTo(page.locator('.sprotty-graph'));
    await expect(end).not.toHaveAttribute('transform', endPos!);
    const draggedEndPos = await end.getAttribute('transform');

    await multiSelect(page, [start, end], browserName);
    await clickQuickActionStartsWith(page, 'Auto');
    await expect(start).toHaveAttribute('transform', startPos!);
    await expect(end).not.toHaveAttribute('transform', draggedEndPos!);
    // end element should only be moved vertically
    await expect(end).toHaveAttribute('transform', /translate\(625, \d+\)/);
  });

  test('wrap, jump and unwrap', async ({ page, browserName }) => {
    const jumpOutBtn = page.locator('#sprotty_jumpOutUi .jump-out-btn i');
    const start = page.locator(startSelector);
    const end = page.locator(endSelector);
    const embedded = page.locator(embeddedSelector);

    await multiSelect(page, [start, end], browserName);
    await clickQuickActionStartsWith(page, 'Wrap');
    await expect(start).toBeHidden();
    await expect(end).toBeHidden();
    await expect(embedded).toBeVisible();

    await embedded.click();
    await clickQuickActionStartsWith(page, 'Jump');
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

  async function editNodeLabel(page: Page, node: Locator, text = 'test label'): Promise<void> {
    await editLabel(page, node, text);
    await expect(node.locator('.sprotty-label div')).toHaveText(text);
  }

  async function deleteNode(page: Page, node: Locator): Promise<void> {
    await node.click();
    await clickQuickAction(page, 'Delete');
  }

  async function assertInformation(page: Page, selector: string, expectedTitle?: string): Promise<void> {
    await page.locator(selector).click();
    await clickQuickActionStartsWith(page, 'Information');
    const title = page.locator('.simple-menu-header');
    if (expectedTitle) {
      await expect(title).toHaveText(expectedTitle);
    } else {
      await expect(title).toBeHidden();
    }
    await expect(page.locator('.simple-menu-text.simple-menu-small')).toContainText('PID: ');
  }
});
