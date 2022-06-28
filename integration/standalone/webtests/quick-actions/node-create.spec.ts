import { expect, Locator, Page, test } from '@playwright/test';
import { endSelector, removeElement, startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { clickQuickActionStartsWith } from './quick-actions-util';

test.describe('quick actions - create node', () => {
  const CREATE_NODE_PALETTE = '.create-node-palette-body';
  const COLLAPSED_CSS_CLASS = /collapsed/;

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await expect(page.locator(CREATE_NODE_PALETTE)).toBeHidden();
  });

  test('switch categories', async ({ page }) => {
    const start = page.locator(startSelector);
    const createNodePalette = page.locator(CREATE_NODE_PALETTE);
    const eventGroup = createNodePalette.locator('#event-group');
    const gatewayGroup = createNodePalette.locator('#gateway-group');
    const activityGroup = createNodePalette.locator('#activity-group');
    const bpmnActivityGroup = createNodePalette.locator('#bpmn-activity-group');
    await expect(createNodePalette).toBeHidden();

    await start.click();
    await switchAndAssertGroup(page, 'Events', eventGroup, [gatewayGroup, activityGroup, bpmnActivityGroup]);
    await switchAndAssertGroup(page, 'Gateways', gatewayGroup, [eventGroup, activityGroup, bpmnActivityGroup]);
    await switchAndAssertGroup(page, 'Activities', activityGroup, [eventGroup, gatewayGroup, bpmnActivityGroup]);
    await switchAndAssertGroup(page, 'BPMN', bpmnActivityGroup, [eventGroup, gatewayGroup, activityGroup]);
  });

  async function switchAndAssertGroup(page: Page, quickAction: string, openGroup: Locator, closedGroups: Locator[]): Promise<void> {
    const createNodePalette = page.locator(CREATE_NODE_PALETTE);
    await clickQuickActionStartsWith(page, quickAction);
    await expect(createNodePalette).toBeVisible();
    await expect(openGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    for (const closedGroup of closedGroups) {
      await expect(closedGroup).toHaveClass(COLLAPSED_CSS_CLASS);
    }
  }

  test('search', async ({ page }) => {
    const start = page.locator(startSelector);
    const createNodePalette = page.locator(CREATE_NODE_PALETTE);
    const searchInput = createNodePalette.locator('.search-input');
    const button = createNodePalette.locator('.tool-button');
    const eventGroup = createNodePalette.locator('#event-group');
    const gatewayGroup = createNodePalette.locator('#gateway-group');
    const activityGroup = createNodePalette.locator('#activity-group');
    await expect(createNodePalette).toBeHidden();

    await start.click();
    await clickQuickActionStartsWith(page, 'Events');
    await expect(createNodePalette).toBeVisible();
    await expect(eventGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(gatewayGroup).toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(activityGroup).toHaveClass(COLLAPSED_CSS_CLASS);

    await searchInput.fill('sk');
    await searchInput.dispatchEvent('keyup');
    await expect(eventGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(gatewayGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(activityGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(button).toHaveCount(3);

    await searchInput.fill('bla');
    await searchInput.dispatchEvent('keyup');
    await expect(button).toHaveCount(1);
    await expect(button).toHaveText('No results found.');
  });

  test('add element', async ({ page }) => {
    await removeElement(page, endSelector);
    const start = page.locator(startSelector);
    const edge = page.locator('.sprotty-graph > g > .sprotty-edge');
    await expect(edge).toHaveCount(0);

    await start.click();
    await addElement(page, 'Activities', 'Script');
    await expect(page.locator('.sprotty-graph .script.selected')).toBeVisible();
    await expect(edge).toHaveCount(1);
  });

  test('add element to existing connection', async ({ page }) => {
    const start = page.locator(startSelector);
    const edge = page.locator('.sprotty-graph > g > .sprotty-edge');
    await expect(edge).toHaveCount(1);

    await start.click();
    await addElement(page, 'Gateways', 'Split');
    await expect(page.locator('.sprotty-graph .split.selected')).toBeVisible();
    await expect(edge).toHaveCount(2);
  });

  async function addElement(page: Page, category: string, activityName: string): Promise<void> {
    const createNodePalette = page.locator(CREATE_NODE_PALETTE);
    await clickQuickActionStartsWith(page, category);
    await expect(createNodePalette).toBeVisible();
    await createNodePalette.locator(`.tool-button:visible:has-text("${activityName}")`).click();
  }
});
