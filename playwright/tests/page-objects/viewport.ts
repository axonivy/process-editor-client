import { expect, type Locator, type Page } from '@playwright/test';
import { Point } from './types';
import { graphLocator } from './graph';

export const ORIGIN_VIEWPORT = 'scale(1) translate(0,48)' as const;

export class ViewportBar {
  protected readonly page: Page;
  protected readonly viewportBar: Locator;
  protected readonly grid: Locator;
  protected readonly graph: Locator;

  constructor(page: Page) {
    this.page = page;
    this.viewportBar = this.page.locator('#sprotty_ivy-viewport-bar');
    this.grid = graphLocator(this.page);
    this.graph = this.grid.locator('> g');
  }

  locator() {
    return this.viewportBar;
  }

  async triggerOrigin() {
    await this.viewportBar.locator('#originBtn').click();
  }

  async triggerFitToScreen() {
    await this.viewportBar.locator('#fitToScreenBtn').click();
  }

  async triggerCenter() {
    await this.viewportBar.locator('#centerBtn').click();
  }

  async expectZoomLevel(zoom: `${number}%` | RegExp) {
    await expect(this.viewportBar).toHaveText(zoom);
  }

  async expectGraphOriginViewport() {
    await this.expectGraphTransform(ORIGIN_VIEWPORT);
  }

  async expectGraphNotOriginViewport() {
    await expect(this.graph).not.toHaveAttribute('transform', ORIGIN_VIEWPORT);
  }

  async expectGraphTransform(expected: string | RegExp) {
    await expect(this.graph).toHaveAttribute('transform', expected);
  }

  async expectGridOriginPosition() {
    await this.expectGridPosition({ x: 0, y: 0 });
  }

  async expectGridNotOriginPosition() {
    const originGridPos = this.gridPosition({ x: 0, y: 0 });
    await expect(this.grid).not.toHaveAttribute('style', originGridPos);
  }

  async expectGridPosition(expectedGridMove: { x: number; y: number }) {
    const expectedGridPos = this.gridPosition(expectedGridMove);
    await expect(this.grid).toHaveAttribute('style', expectedGridPos);
    await this.expectGridOriginSize();
  }

  async expectGridOriginSize() {
    await expect(this.grid).toHaveAttribute('style', /background-size: 16px 16px;/);
  }

  async expectGridNotOriginSize() {
    await expect(this.grid).not.toHaveAttribute('style', /background-size: 16px 16px;/);
  }

  private gridPosition(gridMove: Point) {
    return new RegExp(`background-position: ${8 + gridMove.x}px ${56 + gridMove.y}px;`);
  }
}
