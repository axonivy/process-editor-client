import { expect, type Locator, type Page } from '@playwright/test';
import { cleanDiagram, resetSelection } from './diagram-util';

const TOOL_BAR_MENU = '.tool-bar-menu';

export async function addActivity(page: Page, activityName: string, xPos: number, yPos: number): Promise<void> {
  await assertElementPaletteHidden(page);
  const toolBarMenu = await openElementPalette(page, 'activities');
  await toolBarMenu.locator(`.menu-item:has-text("${activityName}")`).click();
  await page.locator('.sprotty-graph').click({ position: { x: xPos, y: yPos } });
}

export async function addPool(page: Page, yPos: number): Promise<void> {
  createLane(page, 'Pool', yPos);
}

export async function addLane(page: Page, yPos: number): Promise<void> {
  createLane(page, 'Lane', yPos);
}

async function createLane(page: Page, createBtn: string, yPos: number): Promise<void> {
  const toolBarMenu = await openElementPalette(page, 'artifacts');
  await toolBarMenu.locator(`.menu-item:has-text("${createBtn}")`).click();
  await page.locator('.sprotty-graph').click({ position: { x: 10, y: yPos } });
}

export async function assertElementPaletteHidden(page: Page): Promise<void> {
  await expect(page.locator(TOOL_BAR_MENU)).toBeHidden();
}

export async function openElementPalette(page: Page, group: string): Promise<Locator> {
  const menu = page.locator(TOOL_BAR_MENU);
  const menuBtn = page.locator(`#btn_${group}_menu`);
  await expect(menuBtn).toBeVisible();
  await menuBtn.click();
  await expect(menu).toBeVisible();
  return menu;
}

export async function createAllElements(
  page: Page,
  btn: string,
  groupIndex: number,
  expectedElementCount: number,
  checkSelection = true
): Promise<void> {
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
