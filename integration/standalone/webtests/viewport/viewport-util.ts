import { expect, Page } from '@playwright/test';

export const ORIGIN_VIEWPORT = 'scale(1) translate(0,48)';
export const GRAPH_SELECTOR = '.sprotty-graph > g';
export const GRID_SELECTOR = '.sprotty-graph';

export async function assertGraphTransform(page: Page, expected: string | RegExp): Promise<void> {
  const graph = page.locator(GRAPH_SELECTOR);
  await expect(graph).toHaveAttribute('transform', expected);
}

export async function assertGraphOriginViewport(page: Page): Promise<void> {
  const graph = page.locator(GRAPH_SELECTOR);
  await expect(graph).toHaveAttribute('transform', ORIGIN_VIEWPORT);
}

export async function assertGraphNotOriginViewport(page: Page): Promise<void> {
  const graph = page.locator(GRAPH_SELECTOR);
  await expect(graph).not.toHaveAttribute('transform', ORIGIN_VIEWPORT);
  await assertGridNotOriginPosition(page);
}

export async function assertGridOriginPosition(page: Page): Promise<void> {
  await assertGridPosition(page, { x: 0, y: 0 });
}

export async function assertGridNotOriginPosition(page: Page): Promise<void> {
  const originGridPos = gridPosition({ x: 0, y: 0 });
  await expect(page.locator(GRID_SELECTOR)).not.toHaveAttribute('style', originGridPos);
}

export async function assertGridPosition(page: Page, expectedGridMove: { x: number; y: number }): Promise<void> {
  const expectedGridPos = gridPosition(expectedGridMove);
  await expect(page.locator(GRID_SELECTOR)).toHaveAttribute('style', expectedGridPos);
  await assertGridOriginSize(page);
}

export async function assertGridOriginSize(page: Page): Promise<void> {
  await expect(page.locator(GRID_SELECTOR)).toHaveAttribute('style', /background-size: 16px 16px;/);
}

export async function assertGridNotOriginSize(page: Page): Promise<void> {
  await expect(page.locator(GRID_SELECTOR)).not.toHaveAttribute('style', /background-size: 16px 16px;/);
}

function gridPosition(gridMove: { x: number; y: number }): RegExp {
  return new RegExp(`background-position: ${8 + gridMove.x}px ${56 + gridMove.y}px;`);
}
