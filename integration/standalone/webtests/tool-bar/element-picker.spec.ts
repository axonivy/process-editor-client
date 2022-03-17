import { test, expect, Page } from '@playwright/test';
import { cleanDiagram } from '../diagram-util';
import { randomTestProcessUrl } from '../process-editor-url-util';

test.describe('tool bar - element picker', () => {
  const COLLAPSED_CSS_CLASS = /collapsed/;
  const PALETTE_BODY = '.element-palette-body';

  test.beforeEach(async ({ page }) => {
    await page.goto(randomTestProcessUrl());
  });

  test('menu show and hide', async ({ page }) => {
    const paletteBody = page.locator(PALETTE_BODY);
    const eventBtn = page.locator('#btn_ele_picker_event-group');
    await expect(paletteBody).not.toBeVisible();
    await expect(eventBtn).toBeVisible();

    await eventBtn.click();
    await expect(paletteBody).toBeVisible();

    await eventBtn.click();
    await expect(paletteBody).not.toBeVisible();
  });

  test('element groups', async ({ page }) => {
    const paletteBody = page.locator(PALETTE_BODY);
    const eventBtn = page.locator('#btn_ele_picker_event-group');
    const eventGroup = page.locator('#event-group');
    const gatewayBtn = page.locator('#btn_ele_picker_gateway-group');
    const gatewayGroup = page.locator('#gateway-group');
    const connectorBtn = page.locator('#btn_ele_picker_connector-group');
    const connectorGroup = page.locator('#connector-group');
    await expect(paletteBody).not.toBeVisible();

    await eventBtn.click();
    await expect(paletteBody).toBeVisible();
    await expect(eventGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(gatewayGroup).toHaveClass(COLLAPSED_CSS_CLASS);

    await gatewayBtn.click();
    await expect(paletteBody).toBeVisible();
    await expect(eventGroup).toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(gatewayGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);

    await connectorBtn.click();
    await expect(paletteBody).not.toBeVisible();
    await expect(connectorGroup).toHaveClass(COLLAPSED_CSS_CLASS);
  });

  test('connector group', async ({ page }) => {
    const paletteBody = page.locator(PALETTE_BODY);
    const eventBtn = page.locator('#btn_ele_picker_event-group');
    const eventGroup = page.locator('#event-group');
    const connectorBtn = page.locator('#btn_ele_picker_connector-group');
    const connectorGroup = page.locator('#connector-group');
    await expect(paletteBody).not.toBeVisible();

    await eventBtn.click();
    await expect(paletteBody).toBeVisible();
    await expect(eventGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(connectorGroup).toHaveClass(COLLAPSED_CSS_CLASS);

    await connectorBtn.click();
    await expect(paletteBody).not.toBeVisible();
    await expect(connectorGroup).toHaveClass(COLLAPSED_CSS_CLASS);
  });

  test('search', async ({ page }) => {
    const paletteBody = page.locator(PALETTE_BODY);
    const eventBtn = page.locator('#btn_ele_picker_event-group');
    const searchInput = page.locator(PALETTE_BODY + ' .search-input');
    const eventGroup = page.locator('#event-group');
    const gatewayGroup = page.locator('#gateway-group');
    const toolButtons = page.locator(PALETTE_BODY + ' .tool-button');
    await expect(paletteBody).toBeHidden();

    await eventBtn.click();
    await expect(paletteBody).toBeVisible();
    await expect(eventGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(gatewayGroup).toHaveClass(COLLAPSED_CSS_CLASS);

    await searchInput.fill('ta');
    await searchInput.dispatchEvent('keyup');
    await expect(eventGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(gatewayGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(toolButtons).toHaveCount(8);

    await searchInput.fill('bla');
    await searchInput.dispatchEvent('keyup');
    await expect(eventGroup).not.toBeVisible();
    await expect(gatewayGroup).not.toBeVisible();
    await expect(toolButtons).toHaveCount(1);
    await expect(toolButtons).toHaveText('No results found.');

    page.keyboard.press('Escape');
    await expect(searchInput).toBeEmpty();
    await expect(eventGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(gatewayGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
  });

  test('create all events', async ({ page }) => {
    await createAllElements(page, '#btn_ele_picker_event-group', 10);
  });

  test('create all gateways', async ({ page }) => {
    await createAllElements(page, '#btn_ele_picker_gateway-group', 4);
  });

  test('create all activities', async ({ page }) => {
    await createAllElements(page, '#btn_ele_picker_activity-group', 12);
  });

  test('create lanes', async ({ page }) => {
    await createAllElements(page, '#btn_ele_picker_swimlane-group', 2);
  });

  test('create connector', async ({ page }) => {
    const connector = page.locator('.sprotty-graph > g > .sprotty-edge:not(.feedback-edge)');
    const feedbackConnector = page.locator('.sprotty-graph > g > .sprotty-edge.feedback-edge');
    const start = page.locator('.sprotty-graph .start');
    const end = page.locator('.sprotty-graph .end');
    await connector.click();
    await page.keyboard.press('Delete');
    await expect(connector).not.toBeVisible();
    await expect(feedbackConnector).not.toBeVisible();

    await page.locator('#btn_ele_picker_connector-group').click();
    await end.click();
    await expect(feedbackConnector).not.toBeVisible();
    await start.click();
    await expect(feedbackConnector).toBeVisible();
    await end.click();
    await expect(feedbackConnector).not.toBeVisible();
    await expect(connector).toBeVisible();
  });

  async function createAllElements(page: Page, pickerBtnId: string, expectedElementCount: number): Promise<void> {
    await cleanDiagram(page);

    const pickerBtn = page.locator(pickerBtnId);
    await pickerBtn.click();
    const pickers = page.locator(PALETTE_BODY + ' .tool-group:not(.collapsed) .tool-button');
    const pickersCount = await pickers.count();
    for (let i = 0; i < pickersCount; i++) {
      await pickers.nth(i).click();
      await page.locator('.sprotty-graph').click({ position: { x: 30 + 80 * i, y: 100 } });
      await pickerBtn.click();
    }
    await expect(page.locator('.sprotty-graph > g > g')).toHaveCount(expectedElementCount);
  }
});
