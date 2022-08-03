import { expect, Locator, Page, test } from '@playwright/test';
import { resetSelection, multiSelect, startSelector, endSelector, embeddedSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { QUICK_ACTION_BTN } from '../quick-actions/quick-actions-util';

test.describe('key listener - quick action shortcuts', () => {
  const STRAIGHT_CONNECTOR_PATH = /M \d+.?\d*,\d+.?\d* L \d+.?\d*,\d+.?\d*/;
  const BEND_CONNECTOR_PATH = /M \d+,\d+ L \d+,\d+ L \d+,\d+ L \d+,\d+/;

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
  });

  test('connector bend and straigthen', async ({ page }) => {
    const endElement = page.locator(endSelector);
    await endElement.click();
    await endElement.dragTo(page.locator('.sprotty-graph'));
    const connector = page.locator('.sprotty-graph > g > .sprotty-edge');
    const connectorPath = page.locator('.sprotty-graph > g > .sprotty-edge > path').first();
    await expect(connectorPath).toHaveAttribute('d', STRAIGHT_CONNECTOR_PATH);

    await resetSelection(page);
    await connector.click();
    await pressQuickActionShortcut(page, 'B');
    await expect(connectorPath).toHaveAttribute('d', BEND_CONNECTOR_PATH);

    await resetSelection(page);
    await connector.click();
    await pressQuickActionShortcut(page, 'S');
    await expect(connectorPath).toHaveAttribute('d', STRAIGHT_CONNECTOR_PATH);
  });

  test('connector reconnect', async ({ page }) => {
    const connector = page.locator('.sprotty-graph > g > .sprotty-edge:not(.feedback-edge)');
    const connectorFeedback = page.locator('.sprotty-graph > g > .sprotty-edge.feedback-edge');
    await expect(connector).toBeVisible();
    await expect(connectorFeedback).toBeHidden();

    await connector.click();
    await pressQuickActionShortcut(page, 'C');
    await expect(connector).toBeVisible();
    await expect(connectorFeedback).toBeVisible();
  });

  test('label edit', async ({ page, browserName }) => {
    const label = page.locator('.label-edit textarea');
    const start = page.locator(startSelector);
    await expect(start.locator('.sprotty-label div')).toHaveText('start.ivp');
    await expect(label).toBeHidden;

    await start.click();
    await pressQuickActionShortcut(page, 'L');
    await expect(label).toBeVisible();
    await page.keyboard.press('Control+A');
    await page.keyboard.type('test label');
    await page.keyboard.press('Enter');
    await expect(start.locator('.sprotty-label div')).toHaveText('test label');
  });

  test('auto align', async ({ page, browserName }) => {
    const start = page.locator(startSelector);
    const end = page.locator(endSelector);
    await end.dragTo(page.locator('.sprotty-graph'));
    const startTransform = await start.getAttribute('transform');
    const endTransform = await end.getAttribute('transform');

    await multiSelect(page, [start, end], browserName);
    await pressQuickActionShortcut(page, 'A');
    await expect(start).toHaveAttribute('transform', startTransform!);
    await expect(end).not.toHaveAttribute('transform', endTransform!);
    // end element should only be moved vertically
    await expect(end).toHaveAttribute('transform', /translate\(625, \d+\)/);
  });

  test('wrap, jump and unwrap', async ({ page, browserName }) => {
    const jumpOutBtn = page.locator('#sprotty_jumpOutUi .jump-out-btn i');
    const start = page.locator(startSelector);
    const end = page.locator(endSelector);
    const embedded = page.locator(embeddedSelector);

    await multiSelect(page, [start, end], browserName);
    await pressQuickActionShortcut(page, 'S');
    await expect(start).toBeHidden();
    await expect(end).toBeHidden();
    await expect(embedded).toBeVisible();

    await embedded.click();
    await pressQuickActionShortcut(page, 'J');
    await expect(start).toBeVisible();
    await expect(end).toBeVisible();
    await expect(embedded).toBeHidden();
    await expect(jumpOutBtn).toBeVisible();

    await page.keyboard.press('J');
    await expect(start).toBeHidden();
    await expect(end).toBeHidden();
    await expect(embedded).toBeVisible();

    await embedded.click();
    await pressQuickActionShortcut(page, 'U');
    await expect(start).toBeVisible();
    await expect(end).toBeVisible();
    await expect(embedded).toBeHidden();
  });

  test('create node', async ({ page }) => {
    const start = page.locator(startSelector);
    await start.click();
    const menu = await openCreateNodeMenu(page);

    await page.keyboard.press('ArrowDown');
    await expect(menu.locator('.menu-item').nth(1)).toHaveClass(/focus/);
    await page.keyboard.press('ArrowUp');
    await expect(menu.locator('.menu-item').first()).toHaveClass(/focus/);

    await page.keyboard.press('Enter');
    await expect(page.locator('.intermediate\\:taskSwitchEvent.selected')).toBeVisible();

    await openCreateNodeMenu(page);
    await page.keyboard.type('mail');
    await page.keyboard.press('Enter');
    await expect(page.locator('.eMail.selected')).toBeVisible();
  });
});

async function openCreateNodeMenu(page: Page): Promise<Locator> {
  const createNodePalette = page.locator('.quick-action-bar-menu');
  await expect(createNodePalette).toBeHidden();

  await pressHiddenQuickActionShortcut(page, 'A');
  await expect(createNodePalette).toBeVisible();
  await expect(createNodePalette.locator('.menu-search-input')).toBeFocused();
  await expect(createNodePalette.locator('.menu-item').first()).toHaveClass(/focus/);
  return createNodePalette;
}

async function pressQuickActionShortcut(page: Page, shortcut: string): Promise<void> {
  await expect(page.locator(`${QUICK_ACTION_BTN}[title$="(${shortcut})"]`)).toBeVisible();
  await page.keyboard.press(shortcut);
}

async function pressHiddenQuickActionShortcut(page: Page, shortcut: string): Promise<void> {
  await expect(page.locator(QUICK_ACTION_BTN).first()).toBeVisible();
  await page.keyboard.press(shortcut);
}
