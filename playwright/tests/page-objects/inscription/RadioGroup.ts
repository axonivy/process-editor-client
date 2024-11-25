import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class RadioGroup {
  private readonly locator: Locator;

  constructor(parentLocator: Locator) {
    this.locator = parentLocator.locator('.ui-radio-group').first();
  }

  async choose(value: string) {
    await this.locator.getByRole('radio', { name: value, exact: true }).click();
  }

  async expectSelected(value: string) {
    await expect(this.locator.getByRole('radio', { name: value, exact: true })).toBeChecked();
  }
}
