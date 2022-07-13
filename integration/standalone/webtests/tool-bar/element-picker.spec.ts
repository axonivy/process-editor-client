import { test, expect, Page, Locator } from '@playwright/test';
import { cleanDiagram, resetSelection } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test.describe('tool bar - element picker', () => {
  const PALETTE_BODY = '.tool-bar-menu';

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    const paletteBody = page.locator(PALETTE_BODY);
    await expect(paletteBody).toBeHidden();
  });

  test('menu show and hide', async ({ page }) => {
    const paletteBody = await openElementPalette(page, 'events');
    await page.locator('#btn_events_menu').click();
    await expect(paletteBody).toBeHidden();
  });

  test('search', async ({ page }) => {
    const eventGroup = page.locator('#event-group');
    const gatewayGroup = page.locator('#gateway-group');

    const menu = await openElementPalette(page, 'all_elements');
    const searchInput = menu.locator('.menu-search-input');
    const elementGroup = menu.locator('.menu-group');
    const elements = menu.locator('.menu-item');
    const noResult = menu.locator('.no-result');
    await expect(elementGroup).toHaveCount(5);

    await searchInput.fill('ta');
    await searchInput.dispatchEvent('keyup');
    await expect(elementGroup).toHaveCount(3);
    await expect(elements).toHaveCount(8);

    await searchInput.fill('bla');
    await searchInput.dispatchEvent('keyup');
    await expect(eventGroup).toBeHidden();
    await expect(gatewayGroup).toBeHidden();
    await expect(elementGroup).toHaveCount(0);
    await expect(elements).toHaveCount(0);
    await expect(noResult).toHaveCount(1);
    await expect(noResult).toHaveText('No results found.');

    await page.keyboard.press('Escape');
    await expect(searchInput).toBeEmpty();
  });

  test('create all events', async ({ page }) => {
    await createAllElements(page, 'events', 0, 9);
  });

  test('create all gateways', async ({ page }) => {
    await createAllElements(page, 'gateways', 0, 4);
  });

  test('create all activities', async ({ page }) => {
    await createAllElements(page, 'activities', 0, 13);
  });

  test('create all bpmn activities', async ({ page }) => {
    await createAllElements(page, 'activities', 1, 8);
  });

  test('create lanes', async ({ page }) => {
    await createAllElements(page, 'swimlanes', 0, 2, false);
  });

  async function createAllElements(page: Page, btn: string, groupIndex: number, expectedElementCount: number, checkSelection = true): Promise<void> {
    await cleanDiagram(page);
    const menu = await openElementPalette(page, btn);

    const elements = page.locator('.sprotty-graph > g > g');
    const pickers = menu.locator('.menu-group-items').nth(groupIndex).locator('.menu-item');
    const pickersCount = await pickers.count();
    for (let i = 0; i < pickersCount; i++) {
      await pickers.nth(i).click();
      await page.locator('.sprotty-graph').click({ position: { x: 30 + 80 * i, y: 100 } });
      await expect(elements).toHaveCount(i + 1);
      if (checkSelection) {
        await expect(elements.last()).toHaveAttribute('class', /selected/);
      }
      await resetSelection(page);
      await openElementPalette(page, btn);
    }
    await expect(page.locator('.sprotty-graph > g > g')).toHaveCount(expectedElementCount);
  }

  async function openElementPalette(page: Page, group: string): Promise<Locator> {
    const paletteBody = page.locator(PALETTE_BODY);
    const paletteBtn = page.locator(`#btn_${group}_menu`);
    await expect(paletteBtn).toBeVisible();
    await paletteBtn.click();
    await expect(paletteBody).toBeVisible();
    return paletteBody;
  }
});
