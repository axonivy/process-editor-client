import { expect, Locator, Page } from '@playwright/test';

export class SearchPalette {
  readonly suggestions: Locator;
  readonly searchField: Locator;

  constructor(readonly page: Page) {
    this.suggestions = this.page.locator('div.command-palette-suggestions');
    this.searchField = this.page.locator('div.autocomplete-palette').locator('input');
  }

  async openAndAssertVisible() {
    await this.page.keyboard.press('Control+KeyF');
    await expect(this.suggestions).toBeVisible();
  }

  suggestion(text: string) {
    return this.suggestions.getByText(text);
  }

  async expectHidden() {
    await expect(this.suggestions).toBeHidden();
  }
}
