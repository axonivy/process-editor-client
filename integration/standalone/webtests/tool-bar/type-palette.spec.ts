import { test, expect, Locator, Page } from '@playwright/test';
import { embeddedSelector, endSelector, multiSelect, startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { clickQuickActionStartsWith } from '../quick-actions/quick-actions-util';

test.describe('tool bar - BPMN type palette', () => {
  const PALETTE_BODY = '.activity-type-palette-body';

  test.beforeEach(async ({ page, browserName }) => {
    await gotoRandomTestProcessUrl(page);
    const paletteBody = page.locator(PALETTE_BODY);
    await paletteBody.innerHTML();
    await expect(paletteBody).toBeHidden();

    const start = page.locator(startSelector);
    const end = page.locator(endSelector);
    await wrapToEmbedded([start, end], page, browserName);
  });

  test('search', async ({ page, browserName }) => {
    const searchInput = page.locator(PALETTE_BODY + ' .search-input');
    const toolButtons = page.locator(PALETTE_BODY + ' .tool-button');

    await openTypePalette(page);
    await expect(toolButtons).toHaveCount(9);
    await searchInput.fill('ser');
    await searchInput.dispatchEvent('keyup');
    await expect(toolButtons).toHaveCount(2);

    await searchInput.fill('bla');
    await searchInput.dispatchEvent('keyup');
    await expect(toolButtons).toHaveCount(1);
    await expect(toolButtons).toHaveText('No results found.');

    page.keyboard.press('Escape');
    await expect(searchInput).toBeEmpty();
  });

  test('switch type', async ({ page, browserName }) => {
    const toolButtons = page.locator(PALETTE_BODY + ' .tool-button');
    const userIcon = page.locator('.sprotty-graph .userBpmnElement .fa-user');
    const embedded = page.locator(embeddedSelector);
    const user = page.locator('.sprotty-graph .userBpmnElement');

    await expect(embedded).toBeVisible();
    await expect(user).toBeHidden();
    await expect(userIcon).toBeHidden();

    await openTypePalette(page);
    await toolButtons.locator('text=User').click();
    await expect(userIcon).toBeVisible();
    await expect(user).toBeVisible();
    await expect(embedded).toBeHidden();

    await openTypePalette(page, false);
    await toolButtons.locator('text=Sub').click();
    await expect(embedded).toBeVisible();
    await expect(user).toBeHidden();
    await expect(userIcon).toBeHidden();
  });

  async function wrapToEmbedded(elements: Locator[], page: Page, browserName: string): Promise<void> {
    await multiSelect(page, elements, browserName);
    await clickQuickActionStartsWith(page, 'Wrap');
  }

  async function openTypePalette(page: Page, select = true): Promise<Locator> {
    const paletteBody = page.locator(PALETTE_BODY);
    const dynamicTools = page.locator('.dynamic-tools');
    const typePaletteBtn = dynamicTools.locator('i[title$=Type]');

    if (select) {
      await expect(dynamicTools).toBeHidden();
      await page.locator(embeddedSelector).click();
    }

    await expect(dynamicTools).toBeVisible();
    await expect(typePaletteBtn).toBeVisible();
    await typePaletteBtn.click();
    await expect(paletteBody).toBeVisible();
    return paletteBody;
  }
});
