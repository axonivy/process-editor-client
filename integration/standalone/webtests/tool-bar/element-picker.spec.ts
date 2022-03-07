import { test, expect } from '@playwright/test';
import { procurementRequestParallelUrl } from '../process-editor-url-util';

test.describe('tool bar - element picker', () => {
  const COLLAPSED_CSS_CLASS = /collapsed/;
  const PALETTE_BODY = '.element-palette-body';

  test.beforeEach(async ({ page }) => {
    await page.goto(procurementRequestParallelUrl());
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
});
