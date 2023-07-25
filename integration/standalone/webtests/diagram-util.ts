import { expect, Locator, Page } from '@playwright/test';

export const startSelector = '.sprotty-graph .start\\:requestStart';
export const endSelector = '.sprotty-graph .end\\:taskEnd';
export const embeddedSelector = '.sprotty-graph .embeddedProcessElement';

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
    await expect(element).toHaveAttribute('class', /selected/);
  }
  await page.keyboard.up(ctrl);
}

export async function resetSelection(page: Page): Promise<void> {
  const graph = page.locator('#sprotty');
  await expect(graph).toBeVisible();
  const bounds = await graph.boundingBox();
  await graph.click({ position: { x: bounds!.width - 1, y: bounds!.height - 80 } });
  await expect(page.locator('g.selected')).toHaveCount(0);
}

export function getCtrl(browserName?: string): string {
  if (browserName === 'webkit' || isMac()) {
    return 'Meta';
  } else {
    return 'Control';
  }
}

export function isMac(): boolean {
  return process.platform === 'darwin';
}

export async function cleanDiagram(page: Page): Promise<void> {
  await removeElement(page, startSelector);
  await removeElement(page, endSelector);
}

export async function removeElement(page: Page, element: string): Promise<void> {
  await page.locator(element).click();
  await page.keyboard.press('Delete');
  await expect(page.locator(element)).toBeHidden();
}

export interface Point {
  readonly x: number;
  readonly y: number;
}

export async function assertPosition(element: Locator, expectedPosition: Point): Promise<void> {
  await expect(element).toHaveAttribute('transform', `translate(${expectedPosition.x}, ${expectedPosition.y})`);
}

export async function assertPositionIsNot(element: Locator, expectedPosition: Point): Promise<void> {
  await expect(element).not.toHaveAttribute('transform', `translate(${expectedPosition.x}, ${expectedPosition.y})`);
}

export async function getPosition(element: Locator): Promise<Point> {
  const transform = await element.getAttribute('transform');
  const position = transform!.substring(transform!.indexOf('(') + 1, transform!.indexOf(')'));
  const x = parseInt(position.split(',')[0].trim(), 10);
  const y = parseInt(position.split(',')[1].trim(), 10);
  return { x: x, y: y };
}
