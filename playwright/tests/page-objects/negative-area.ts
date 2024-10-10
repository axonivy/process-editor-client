import { expect, type Locator, type Page } from '@playwright/test';
import { graphLocator } from './graph';

export class NegativeArea {
  readonly page: Page;
  readonly area: Locator;

  constructor(page: Page) {
    this.page = page;
    this.area = graphLocator(page).locator('.negative-area');
  }

  async expectVisible() {
    await expect(this.area).toHaveCount(2);
    await expect(this.area.first()).toBeVisible();
    await expect(this.area.last()).toBeVisible();
  }

  async expectHidden() {
    await expect(this.area).toHaveCount(2);
    await expect(this.area.first()).toBeHidden();
    await expect(this.area.last()).toBeHidden();
  }
}
