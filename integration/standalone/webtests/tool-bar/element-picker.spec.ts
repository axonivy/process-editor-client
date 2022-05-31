import { test, expect, Page, Locator } from '@playwright/test';
import { cleanDiagram } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test.describe('tool bar - element picker', () => {
  const COLLAPSED_CSS_CLASS = /collapsed/;
  const PALETTE_BODY = '.element-palette-body';

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    const paletteBody = page.locator(PALETTE_BODY);
    await paletteBody.innerHTML();
    await expect(paletteBody).toBeHidden();
  });

  test('menu show and hide', async ({ page }) => {
    const paletteBody = await openElementPalette(page, 'event-group');
    await page.locator('#btn_ele_picker_event-group').click();
    await expect(paletteBody).not.toBeVisible();
  });

  test('element groups', async ({ page }) => {
    const eventGroup = page.locator('#event-group');
    const gatewayGroup = page.locator('#gateway-group');
    await openElementPalette(page, 'event-group');
    await expect(gatewayGroup).toHaveClass(COLLAPSED_CSS_CLASS);

    await openElementPalette(page, 'gateway-group');
    await expect(eventGroup).toHaveClass(COLLAPSED_CSS_CLASS);
  });

  test('search', async ({ page }) => {
    const searchInput = page.locator(PALETTE_BODY + ' .search-input');
    const eventGroup = page.locator('#event-group');
    const gatewayGroup = page.locator('#gateway-group');
    const toolButtons = page.locator(PALETTE_BODY + ' .tool-button');

    await openElementPalette(page, 'event-group');
    await searchInput.fill('ta');
    await searchInput.dispatchEvent('keyup');
    await expect(eventGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(gatewayGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(toolButtons).toHaveCount(8);

    await searchInput.fill('bla');
    await searchInput.dispatchEvent('keyup');
    await expect(eventGroup).toBeHidden();
    await expect(gatewayGroup).toBeHidden();
    await expect(toolButtons).toHaveCount(1);
    await expect(toolButtons).toHaveText('No results found.');

    await page.keyboard.press('Escape');
    await expect(searchInput).toBeEmpty();
    await expect(eventGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    await expect(gatewayGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
  });

  test('create all events', async ({ page }) => {
    await createAllElements(page, 'event-group', 9);
  });

  test('create all gateways', async ({ page }) => {
    await createAllElements(page, 'gateway-group', 4);
  });

  test('create all activities', async ({ page }) => {
    await createAllElements(page, 'activity-group', 13);
  });

  test('create all bpmn activities', async ({ page }) => {
    await createAllElements(page, 'bpmn-activity-group', 8);
  });

  test('create lanes', async ({ page }) => {
    await createAllElements(page, 'swimlane-group', 2);
  });

  async function createAllElements(page: Page, group: string, expectedElementCount: number): Promise<void> {
    await cleanDiagram(page);
    await openElementPalette(page, group);

    const pickers = page.locator(PALETTE_BODY + ' .tool-group:not(.collapsed) .tool-button');
    const pickersCount = await pickers.count();
    for (let i = 0; i < pickersCount; i++) {
      await pickers.nth(i).click();
      await page.locator('.sprotty-graph').click({ position: { x: 30 + 80 * i, y: 100 } });
      await openElementPalette(page, group);
    }
    await expect(page.locator('.sprotty-graph > g > g')).toHaveCount(expectedElementCount);
  }

  async function openElementPalette(page: Page, group: string): Promise<Locator> {
    const paletteBody = page.locator(PALETTE_BODY);
    const paletteBtn = page.locator(`#btn_ele_picker_${group}`);
    await expect(paletteBtn).toBeVisible();
    await paletteBtn.click();
    await expect(paletteBody).toBeVisible();
    const eventGroup = page.locator(`#${group}`);
    await expect(eventGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
    return paletteBody;
  }
});
