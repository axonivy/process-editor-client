import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Part } from './part';
import { Tab } from './tab';
import type { PartStateFlag } from '@axonivy/process-editor-inscription-view/src/components/editors/part/usePart';

export class Accordion extends Part {
  private readonly toggleButtonLocator: Locator;

  constructor(page: Page, readonly label: string) {
    super(page, Accordion.locator(page, label));
    this.toggleButtonLocator = Accordion.toggleButtonLocator(page, label);
  }

  async toggle() {
    await this.toggleButtonLocator.click();
  }

  private static locator(page: Page, label: string) {
    return page.locator(`.ui-accordion-item`, { has: Accordion.toggleButtonLocator(page, label) });
  }

  private static toggleButtonLocator(page: Page, label: string) {
    return page.locator(`.ui-accordion-trigger:has-text("${label}")`);
  }

  tab(label: string) {
    return new Tab(this.page, this.locator, label);
  }

  reset() {
    return this.page.locator(`button[aria-label="Reset ${this.label}"]`);
  }

  async expectState(state: PartStateFlag) {
    const stateLocator = this.locator.locator('.ui-state-dot');
    if (state) {
      await expect(stateLocator).toHaveAttribute('data-state', state);
    } else {
      await expect(stateLocator).toBeHidden();
    }
  }
}