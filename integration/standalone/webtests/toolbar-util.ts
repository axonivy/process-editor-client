import { expect, Locator, Page } from '@playwright/test';

export async function addActivity(page: Page, activityName: string, xPos: number, yPos: number): Promise<void> {
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
  const toolBarMenu = await openElementPalette(page, 'swimlanes');
  await toolBarMenu.locator(`.menu-item:has-text("${createBtn}")`).click();
  await page.locator('.sprotty-graph').click({ position: { x: 10, y: yPos } });
}

async function openElementPalette(page: Page, group: string): Promise<Locator> {
  const toolbarMenu = page.locator('.tool-bar-menu');
  await expect(toolbarMenu).toBeHidden();
  const elementBtn = page.locator(`#btn_${group}_menu`);
  await expect(elementBtn).toBeVisible();
  await elementBtn.click();
  await expect(toolbarMenu).toBeVisible();
  return toolbarMenu;
}
