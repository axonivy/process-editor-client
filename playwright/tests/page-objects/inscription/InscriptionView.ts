import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Accordion } from './Accordion';

export class InscriptionView {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async selectElement(page: Page, pid: string, pmv = 'inscription-test-project') {
    const view = new InscriptionView(page);
    const server = process.env.BASE_URL ?? 'localhost:8081';
    const app = process.env.TEST_APP ?? 'designer';
    const serverUrl = server.replace(/^https?:\/\//, '');
    const url = `?server=${serverUrl}&app=${app}&pmv=${pmv}&pid=${pid}`;
    await page.goto(url);
    await this.initPage(page);
    return view;
  }

  static async mock(page: Page, options?: { type?: string; readonly?: boolean; theme?: string }) {
    const view = new InscriptionView(page);
    let url = 'mock.html';
    if (options) {
      url += '?';
      if (options.type) {
        url += `type=${options.type}&`;
      }
      if (options.readonly) {
        url += `readonly=${options.readonly}&`;
      }
      if (options.theme) {
        url += `theme=${options.theme}&`;
      }
    }
    await page.goto(url);
    await this.initPage(page);
    await page.waitForSelector('.editor-root');
    return view;
  }

  static async initPage(page: Page) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await InscriptionView.hideQueryDevTools(page);
  }

  accordion(partName: string) {
    return new Accordion(this.page, partName);
  }

  async expectHeaderText(text: string, timeout?: number) {
    await expect(this.page.getByText(text).first()).toBeVisible({ timeout });
  }

  async expectMutationStateSuccess() {
    await expect(this.page.locator('.editor-root')).toHaveAttribute('data-mutation-state', 'success');
  }

  async reload() {
    await this.page.reload();
    await InscriptionView.hideQueryDevTools(this.page);
  }

  static async hideQueryDevTools(page: Page) {
    await page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
  }
}
