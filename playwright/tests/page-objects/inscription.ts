import { expect, type Locator, type Page } from '@playwright/test';
import { Outline } from './outline';

export class Inscription {
  protected readonly page: Page;
  protected readonly view: Locator;

  constructor(page: Page) {
    this.page = page;
    this.view = this.page.locator('#inscription-ui');
  }

  locator() {
    return this.view;
  }

  input(label: string) {
    return new Input(this.page, this.view, label);
  }

  monaco() {
    return new MonacoEditor(this.page, this.view);
  }

  async openAccordion(name: string) {
    const accordion = new Accordion(this.page, this.view, name);
    await accordion.open();
    return accordion;
  }

  async openSection(name: string) {
    const section = this.view.locator(`.ui-collapsible-trigger:has-text("${name}")`);
    await expect(section).toBeVisible();
    if ((await section.getAttribute('data-state')) === 'closed') {
      await section.click();
    }
    return section;
  }

  async toggleOutline() {
    const outline = new Outline(this.page, this.view);
    await outline.open();
    return outline;
  }

  async expectOpen() {
    await expect(this.view).not.toHaveClass(/hidden/);
  }

  async expectClosed() {
    await expect(this.view).toHaveClass(/hidden/);
  }

  async expectHeader(name: string | RegExp) {
    await expect(this.view.locator('.header')).toHaveText(name);
  }
}

class Accordion {
  protected readonly page: Page;
  protected readonly section: Locator;

  constructor(page: Page, parentLocator: Locator, name: string) {
    this.page = page;
    this.section = parentLocator.locator(`.ui-accordion-header:has-text("${name}")`);
  }

  async open() {
    await expect(this.section).toBeVisible();
    if ((await this.section.getAttribute('data-state')) === 'closed') {
      await this.section.click();
    }
    await this.expectOpen();
  }

  async undo() {
    await this.section.locator('.ivy-undo').click();
  }

  async expectOpen() {
    await expect(this.section).toHaveAttribute('data-state', 'open');
  }

  async expectClosed() {
    await expect(this.section).toHaveAttribute('data-state', 'closed');
  }
}

class Input {
  protected readonly page: Page;
  protected readonly input: Locator;

  constructor(page: Page, parentLocator: Locator, label: string) {
    this.page = page;
    this.input = parentLocator.getByLabel(label);
  }

  async fill(value: string) {
    await this.input.clear();
    await this.input.fill(value);
    await this.input.blur();
  }

  async expectValue(value: string | RegExp) {
    await expect(this.input).toHaveValue(value);
  }
}

class MonacoEditor {
  protected readonly page: Page;
  protected readonly monaco: Locator;
  protected readonly contentAssist: Locator;

  constructor(page: Page, parentLocator: Locator) {
    this.page = page;
    this.monaco = parentLocator.locator('.code-input');
    this.contentAssist = parentLocator.locator('div.editor-widget.suggest-widget');
  }

  async expectContentAssist(expectedCompletion: string) {
    await expect(this.monaco).toBeVisible();
    await this.monaco.click();
    await this.page.keyboard.press('Control+Space');
    await expect(this.contentAssist).toBeVisible();
    await expect(this.contentAssist).toContainText(expectedCompletion);
    await this.page.keyboard.press('Escape');
    await expect(this.contentAssist).not.toBeVisible();
  }
}
