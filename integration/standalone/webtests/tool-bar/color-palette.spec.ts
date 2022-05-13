import { test, expect, Page, Locator } from '@playwright/test';
import { addLane, endSelector, multiSelect, resetSelection, startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test.describe('tool bar - color palette', () => {
  const PALETTE_BODY = '.color-palette-body';

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
  });

  test('open and close menu', async ({ page }) => {
    const paletteBody = page.locator(PALETTE_BODY);
    const dynamicTools = page.locator('.dynamic-tools');
    const colorPaletteBtn = dynamicTools.locator('i[title$=color]');
    const startElement = page.locator(startSelector);
    await expect(paletteBody).toBeHidden();
    await expect(dynamicTools).toBeHidden();

    await startElement.click();
    await expect(dynamicTools).toBeVisible();
    await expect(colorPaletteBtn).toBeVisible();

    await colorPaletteBtn.click();
    await expect(paletteBody).toBeVisible();

    await colorPaletteBtn.click();
    await expect(paletteBody).toBeHidden();
  });

  test('search', async ({ page }) => {
    const paletteBody = page.locator(PALETTE_BODY);
    const dynamicTools = page.locator('.dynamic-tools');
    const colorPaletteBtn = dynamicTools.locator('i[title$=color]');
    const searchInput = page.locator(PALETTE_BODY + ' .search-input');
    const toolButtons = page.locator(PALETTE_BODY + ' .tool-button');
    const startElement = page.locator(startSelector);
    await expect(paletteBody).toBeHidden();
    await expect(dynamicTools).toBeHidden();

    await startElement.click();
    await expect(dynamicTools).toBeVisible();
    await expect(colorPaletteBtn).toBeVisible();

    await colorPaletteBtn.click();
    await expect(paletteBody).toBeVisible();

    await searchInput.fill('re');
    await searchInput.dispatchEvent('keyup');
    await expect(toolButtons).toHaveCount(2);

    await searchInput.fill('bla');
    await searchInput.dispatchEvent('keyup');
    await expect(toolButtons).toHaveCount(1);
    await expect(toolButtons).toHaveText('No results found.');

    page.keyboard.press('Escape');
    await expect(searchInput).toBeEmpty();
  });

  test('colorize node', async ({ page, browserName }) => {
    const startElement = page.locator(startSelector + ' .sprotty-node');

    await expect(startElement).not.toHaveAttribute('style', /stroke: rgb(\d+, \d+, \d+);/);
    await colorizeElement(page, [startElement], browserName);
    await expect(startElement).toHaveAttribute('style', 'stroke: rgb(0, 0, 255);');
  });

  test('colorize connector', async ({ page, browserName }) => {
    const connector = page.locator('.sprotty-graph g.sprotty-edge');
    const connectorPath = page.locator('.sprotty-graph g.sprotty-edge path').first();

    await expect(connectorPath).not.toHaveAttribute('style', /stroke: rgb(\d+, \d+, \d+);/);
    await colorizeElement(page, [connector], browserName);
    await expect(connectorPath).toHaveAttribute('style', 'stroke: rgb(0, 0, 255);');
  });

  test('colorize lane', async ({ page, browserName }) => {
    await addLane(page, 90);
    const lane = page.locator('.sprotty-graph .lane');
    const laneRect = page.locator('.sprotty-graph .lane > rect');

    await expect(laneRect).not.toHaveAttribute('style', /fill: rgb(\d+, \d+, \d+); fill-opacity: 0.1;/);
    await colorizeElement(page, [lane], browserName);
    await expect(laneRect).toHaveAttribute('style', 'fill: rgb(0, 0, 255); fill-opacity: 0.1;');
  });

  test('colorize multiple elements', async ({ page, browserName }) => {
    const startElement = page.locator(startSelector + ' .sprotty-node');
    const endElement = page.locator(endSelector + ' .sprotty-node');

    await expect(startElement).not.toHaveAttribute('style', /stroke: rgb(\d+, \d+, \d+);/);
    await expect(endElement).not.toHaveAttribute('style', /stroke: rgb(\d+, \d+, \d+);/);
    await colorizeElement(page, [startElement, endElement], browserName);
    await expect(startElement).toHaveAttribute('style', 'stroke: rgb(0, 0, 255);');
    await expect(endElement).toHaveAttribute('style', 'stroke: rgb(0, 0, 255);');
  });

  test('cancel change color dialog', async ({ page, browserName }) => {
    const paletteBody = await openColorPalette(page);
    await paletteBody.locator('.group-header .edit-item-button').click();

    const dialog = paletteBody.locator('.edit-color-dialog');
    await expect(dialog).toBeVisible();

    await dialog.locator('.edit-color-cancel-btn').click();
    await expect(dialog).toBeHidden();
  });

  test('add new and remove color', async ({ page, browserName }) => {
    const paletteBody = await openColorPalette(page);
    await paletteBody.locator('.group-header .edit-item-button').click();

    const dialog = paletteBody.locator('.edit-color-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('.edit-color-delete-btn')).toBeHidden();

    const nameInput = dialog.locator('#editInputName');
    await expect(nameInput).toBeEmpty();
    await nameInput.fill('TestColor');

    const colorInput = dialog.locator('#editInputColor');
    await expect(colorInput).toBeEmpty();
    await colorInput.fill('#fff000');

    await dialog.locator('.edit-color-confirm-btn').click();
    await expect(dialog).toBeHidden();
    await expect(paletteBody).toBeHidden();

    await resetSelection(page);
    await openColorPalette(page);
    const newColor = paletteBody.locator('.tool-button').locator('text=TestColor');
    await expect(newColor).toBeVisible();
    await newColor.locator('.edit-item-button').click();

    await expect(dialog).toBeVisible();
    await expect(nameInput).toHaveValue('TestColor');
    await expect(colorInput).toHaveValue('#fff000');

    await dialog.locator('.edit-color-delete-btn').click();
    await expect(dialog).toBeHidden();
    await expect(paletteBody).toBeHidden();
    await resetSelection(page);
    await openColorPalette(page);
    await expect(newColor).toBeHidden();
  });

  async function colorizeElement(page: Page, elements: Locator[], browserName: string): Promise<void> {
    const colorPalette = page.locator(PALETTE_BODY);
    const dynamicTools = page.locator('.dynamic-tools');
    const colorPaletteBtn = dynamicTools.locator('i[title$=color]');
    const toolButtons = page.locator(PALETTE_BODY + ' .tool-button');

    await expect(colorPaletteBtn).not.toBeVisible();
    await multiSelect(page, elements, browserName);
    await expect(dynamicTools).toBeVisible();
    await expect(colorPaletteBtn).toBeVisible();
    await colorPaletteBtn.click();

    await expect(colorPalette).toBeVisible();
    await toolButtons.locator('text=Blue').click();
  }

  async function openColorPalette(page: Page): Promise<Locator> {
    const paletteBody = page.locator(PALETTE_BODY);
    const dynamicTools = page.locator('.dynamic-tools');
    const colorPaletteBtn = dynamicTools.locator('i[title$=color]');
    const startElement = page.locator(startSelector);
    await expect(paletteBody).toBeHidden();
    await expect(dynamicTools).toBeHidden();

    await startElement.click();
    await colorPaletteBtn.click();
    return paletteBody;
  }
});
