import type { Locator, Page} from '@playwright/test';
import { expect } from '@playwright/test';

export class Tags {
  constructor(readonly page: Page, readonly locator: Locator) {}

  async addTags(tags: string[]) {
    for (let i = 0; i < tags.length; i++) {
      await this.locator.getByRole('button', { name: 'Add new tag' }).click();
      const input = this.page.getByLabel('New Tag', { exact: true });
      await input.fill(tags[i]);
      await input.press('Enter');
    }
  }

  async clearTags(tags: string[]) {
    for (let i = 0; i < tags.length; i++) {
      await this.locator.getByRole('button', { name: `Remove Tag ${tags[i]}` }).click();
    }
  }

  async expectTags(tags: string[]) {
    for (let i = 0; i < tags.length; i++) {
      await expect(this.locator.getByRole('gridcell').nth(i)).toHaveText(tags[i]);
    }
  }

  async expectEmpty() {
    await expect(this.locator.getByRole('gridcell')).toHaveCount(0);
  }
}
