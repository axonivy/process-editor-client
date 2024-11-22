import type { Locator, Page } from '@playwright/test';
import { Part } from './Part';

export class Tab extends Part {
  private readonly tabButtonLocator: Locator;

  constructor(page: Page, parentLocator: Locator, label: string) {
    super(page, parentLocator.getByLabel(label));
    this.tabButtonLocator = parentLocator.getByRole('tab', { name: label });
  }

  async switchTo() {
    await this.tabButtonLocator.click();
  }
}
