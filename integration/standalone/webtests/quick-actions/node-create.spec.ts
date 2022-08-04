import { expect, Page, test } from '@playwright/test';
import { endSelector, removeElement, resetSelection, startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { addActivity } from '../toolbar-util';
import { clickQuickActionStartsWith } from './quick-actions-util';

test.describe('quick actions - create node', () => {
  const CREATE_NODE_PALETTE = '.quick-action-bar-menu';

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await expect(page.locator(CREATE_NODE_PALETTE)).toBeHidden();
  });

  test('switch categories', async ({ page }) => {
    await addActivity(page, 'User Dialog', 100, 100);
    const hd = page.locator('.sprotty-graph .dialogCall');
    const createNodePalette = page.locator(CREATE_NODE_PALETTE);
    await expect(createNodePalette).toBeHidden();

    await hd.click();
    await switchAndAssertGroup(page, 'Events', ['Intermediate Events', 'End Events', 'Boundary Events']);
    await switchAndAssertGroup(page, 'Gateways', ['Gateways']);
    await switchAndAssertGroup(page, 'Activities', ['Workflow Activities', 'Interface Activities', 'BPMN Activities']);
  });

  async function switchAndAssertGroup(page: Page, quickAction: string, groups: string[]): Promise<void> {
    const createNodePalette = page.locator(CREATE_NODE_PALETTE);
    await clickQuickActionStartsWith(page, quickAction);
    await expect(createNodePalette).toBeVisible();
    const headers = page.locator('.menu-group-header');
    await expect(headers).toHaveCount(groups.length);
    for (const [index, group] of groups.entries()) {
      await expect(headers.nth(index)).toHaveText(group);
    }
  }

  test('not all elements are listed', async ({ page }) => {
    const start = page.locator(startSelector);

    await start.click();
    await clickQuickActionStartsWith(page, 'Events');
    await searchAndAssert(page, 2);

    await resetSelection(page);
    await removeElement(page, endSelector);

    await start.click();
    await clickQuickActionStartsWith(page, 'Events');
    await searchAndAssert(page, 5);
  });

  async function searchAndAssert(page: Page, expectedFindingCount: number): Promise<void> {
    const createNodePalette = page.locator(CREATE_NODE_PALETTE);
    await expect(createNodePalette).toBeVisible();
    await expect(createNodePalette.locator('.menu-item')).toHaveCount(expectedFindingCount);
  }

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

  test('attach comment', async ({ page }) => {
    const comment = page.locator('.sprotty-graph .processAnnotation');
    const connectors = page.locator('.sprotty-graph > g > .sprotty-edge');
    await expect(comment).not.toBeVisible();
    await expect(connectors).toHaveCount(1);

    await page.locator(startSelector).click();
    await page.keyboard.press('KeyA');
    await addElementFromMenu(page, 'Note');
    await expect(comment).toBeVisible();
    await expect(connectors).toHaveCount(2);
  });

  test('attach error boundary', async ({ page }) => {
    await addActivity(page, 'User Dialog', 200, 200);
    const hd = page.locator('.sprotty-graph .dialogCall');
    const errorBoundary = page.locator('.sprotty-graph .boundary\\:errorBoundaryEvent');
    await expect(errorBoundary).toBeHidden();

    await hd.click();
    await addElement(page, 'Events', 'Error Boundary');
    await expect(errorBoundary).toBeVisible();
  });

  test('attach signal boundary', async ({ page }) => {
    await addActivity(page, 'User Task', 200, 200);
    const userTask = page.locator('.sprotty-graph .userTask');
    const signalBoundary = page.locator('.sprotty-graph .boundary\\:signalBoundaryEvent');
    await expect(signalBoundary).toBeHidden();

    await userTask.click();
    await addElement(page, 'Events', 'Signal Boundary');
    await expect(signalBoundary).toBeVisible();
  });

  async function addElement(page: Page, category: string, element: string): Promise<void> {
    await clickQuickActionStartsWith(page, category);
    await addElementFromMenu(page, element);
  }

  async function addElementFromMenu(page: Page, element: string): Promise<void> {
    const createNodePalette = page.locator(CREATE_NODE_PALETTE);
    await expect(createNodePalette).toBeVisible();
    await createNodePalette.locator(`.menu-item:visible:has-text("${element}")`).first().click();
  }
});
