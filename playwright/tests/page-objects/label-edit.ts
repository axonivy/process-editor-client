import { expect, type Locator, type Page } from '@playwright/test';
import { CmdCtrl } from './types';

export class LabelEdit {
  readonly page: Page;
  readonly textarea: Locator;

  constructor(page: Page) {
    this.page = page;
    this.textarea = this.page.locator('.label-edit textarea');
  }

  locator() {
    return this.textarea;
  }

  async expectVisible() {
    await expect(this.textarea).toBeVisible();
  }

  async expectHidden() {
    await expect(this.textarea).toBeHidden();
  }

  async edit(label: string, cmdCtrl: CmdCtrl) {
    await this.page.keyboard.press(`${cmdCtrl}+A`);
    await this.page.keyboard.type(label);
    await this.page.keyboard.press('Enter');
  }
}
