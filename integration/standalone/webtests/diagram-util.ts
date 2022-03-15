import { expect, Locator, Page } from '@playwright/test';

export async function multiSelect(
  page: Page,
  elements: Locator[],
  browserName: string,
  position?: { x: number; y: number }
): Promise<void> {
  const ctrl = getCtrl(browserName);
  await resetSelection(page);
  await page.keyboard.down(ctrl);
  for (const element of elements) {
    await element.click({ position: position });
  }
  await page.keyboard.up(ctrl);
}

export async function resetSelection(page: Page): Promise<void> {
  const graph = page.locator('.sprotty-graph');
  const graphBox = await graph.boundingBox();
  await graph.click({ position: { x: graphBox.width - 1, y: graphBox.height - 1 } });
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

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface BoundingBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export async function checkBoundingBoxPosition(boungdingBox: BoundingBox, point: Point): Promise<void> {
  expect({ x: boungdingBox.x, y: boungdingBox.y }).toStrictEqual(point);
}
