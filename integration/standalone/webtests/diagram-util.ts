import { Locator, Page } from '@playwright/test';

export async function multiSelect(page: Page, elements: Locator[]): Promise<void> {
  await page.locator('.sprotty-graph').click({ position: { x: 0, y: 60 } });
  await page.keyboard.down('Control');
  for (const element of elements) {
    await element.click();
  }
  await page.keyboard.up('Control');
}

export async function addLane(page: Page, yPos: number): Promise<void> {
  await page.locator('#btn_ele_picker_swimlane-group').click();
  await page.locator('.element-palette-body .tool-button:has-text("Lane")').click();
  await page.locator('.sprotty-graph').click({ position: { x: 10, y: yPos } });
}
