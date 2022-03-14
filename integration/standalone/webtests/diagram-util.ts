import { Locator, Page } from '@playwright/test';

export async function multiSelect(page: Page, elements: Locator[], browserName: string): Promise<void> {
  const ctrl = getCtrl(browserName);
  await resetSelection(page);
  await page.keyboard.down(ctrl);
  for (const element of elements) {
    await element.click();
  }
  await page.keyboard.up(ctrl);
}

export async function resetSelection(page: Page): Promise<void> {
  await page.locator('.sprotty-graph').click({ position: { x: 0, y: 60 } });
}

function getCtrl(browserName: string): string {
  if (browserName === 'webkit') {
    return 'Meta';
  } else {
    return 'Control';
  }
}

export async function cleanDiagram(page: Page): Promise<void> {
  await page.locator('.sprotty-graph .start').click();
  await page.keyboard.press('Delete');
  await page.locator('.sprotty-graph .end').click();
  await page.keyboard.press('Delete');
}

export async function addActivity(page: Page, activityName: string, xPos: number, yPos: number): Promise<void> {
  await page.locator('#btn_ele_picker_activity-group').click();
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
  await page.locator('#btn_ele_picker_swimlane-group').click();
  await page.locator(`.element-palette-body .tool-button:has-text("${createBtn}")`).click();
  await page.locator('.sprotty-graph').click({ position: { x: 10, y: yPos } });
}
