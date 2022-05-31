import { expect, Locator, Page } from '@playwright/test';

export const ELEMENT_PALETTE_BODY = '.element-palette-body';
export const COLLAPSED_CSS_CLASS = /collapsed/;

export async function addActivity(page: Page, activityName: string, xPos: number, yPos: number): Promise<void> {
  await openElementPalette(page, 'activity-group');
  await page.locator(`.element-palette-body .tool-button:has-text("${activityName}")`).click();
  await page.locator('.sprotty-graph').click({ position: { x: xPos, y: yPos } });
}

export async function addPool(page: Page, yPos: number): Promise<void> {
  createLane(page, 'Pool', yPos);
}

export async function addLane(page: Page, yPos: number): Promise<void> {
  createLane(page, 'Lane', yPos);
}

async function createLane(page: Page, createBtn: string, yPos: number): Promise<void> {
  await openElementPalette(page, 'swimlane-group');
  await page.locator(`${ELEMENT_PALETTE_BODY} .tool-button:has-text("${createBtn}")`).click();
  await page.locator('.sprotty-graph').click({ position: { x: 10, y: yPos } });
}

async function openElementPalette(page: Page, group: string): Promise<Locator> {
  const paletteBody = page.locator(ELEMENT_PALETTE_BODY);
  const paletteBtn = page.locator(`#btn_ele_picker_${group}`);
  await paletteBody.innerHTML();
  await expect(paletteBtn).toBeVisible();
  await paletteBtn.click();
  await expect(paletteBody).toBeVisible();
  const eventGroup = page.locator(`#${group}`);
  await expect(eventGroup).not.toHaveClass(COLLAPSED_CSS_CLASS);
  return paletteBody;
}
