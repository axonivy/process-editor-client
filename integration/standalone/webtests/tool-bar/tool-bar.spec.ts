import { test, expect, Page, Locator } from '@playwright/test';
import { removeElement, startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test.describe('tool bar', () => {
  const ACTIVE_CSS_CLASS = /clicked/;
  const DEFAULT_TOOL = '#btn_default_tools';
  const MARQUEE_TOOL = '#btn_marquee_tools';

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await expect(page.locator('.ivy-tool-bar')).toBeVisible();
    await expect(page.locator(startSelector)).toBeVisible();
  });

  test('switch tool', async ({ page }) => {
    const defaultToolBtn = page.locator(DEFAULT_TOOL);
    const marqueeToolBtn = page.locator(MARQUEE_TOOL);
    await expect(defaultToolBtn).toHaveClass(ACTIVE_CSS_CLASS);
    await expect(marqueeToolBtn).not.toHaveClass(ACTIVE_CSS_CLASS);

    await marqueeToolBtn.click();
    await expect(defaultToolBtn).not.toHaveClass(ACTIVE_CSS_CLASS);
    await expect(marqueeToolBtn).toHaveClass(ACTIVE_CSS_CLASS);

    await defaultToolBtn.click();
    await expect(defaultToolBtn).toHaveClass(ACTIVE_CSS_CLASS);
    await expect(marqueeToolBtn).not.toHaveClass(ACTIVE_CSS_CLASS);
  });

  test('marquee tool', async ({ page }) => {
    const MARQUEE_MODE_CSS_CLASS = /marquee-mode/;
    const marqueeToolBtn = page.locator(MARQUEE_TOOL);
    const graph = page.locator('.sprotty-graph');
    await expect(graph).not.toHaveClass(MARQUEE_MODE_CSS_CLASS);

    await marqueeToolBtn.click();
    await expect(graph).not.toHaveClass(MARQUEE_MODE_CSS_CLASS);

    await page.mouse.move(10, 50);
    await page.mouse.down();
    await page.mouse.move(400, 200);
    await page.mouse.up();

    await expect(page.locator('g.selected')).toHaveCount(3);
  });

  test('undo / redo', async ({ page }) => {
    const undoToolBtn = page.locator('#btn_undo_tools');
    const redoToolBtn = page.locator('#btn_redo_tools');
    const start = page.locator(startSelector);
    await expect(start).toBeVisible();

    await removeElement(page, startSelector);
    await expect(start).toBeHidden();

    await undoToolBtn.click();
    await expect(start).toBeVisible();

    await redoToolBtn.click();
    await expect(start).toBeHidden();
  });

  test('options - toggle theme', async ({ page }) => {
    const graph = page.locator('.sprotty-graph');
    await expect(graph).toHaveCSS('background-color', 'rgb(255, 255, 255)');

    const menu = await openOptionsMenu(page);
    await toggleOption(menu, 'Darkmode', false);
    await expect(graph).toHaveCSS('background-color', 'rgb(30, 30, 30)');

    await toggleOption(menu, 'Darkmode', true);
    await expect(graph).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  });

  test('options - toggle grid', async ({ page }) => {
    const graph = page.locator('.sprotty-graph');
    await expect(graph).not.toHaveAttribute('class', /grid/);

    const menu = await openOptionsMenu(page);
    await toggleOption(menu, 'Grid', false);
    await expect(graph).toHaveAttribute('class', /grid/);

    await toggleOption(menu, 'Grid', true);
    await expect(graph).not.toHaveAttribute('class', /grid/);
  });

  test('options - toggle custom icons', async ({ page }) => {
    const menu = await openOptionsMenu(page);
    await toggleOption(menu, 'Custom Image', true);
    await toggleOption(menu, 'Custom Image', false);
  });

  async function toggleOption(menu: Locator, option: string, initalValue: boolean): Promise<void> {
    const toggle = menu.locator(`.tool-bar-option label:has-text("${option}") ~ .switch`);
    const toggleInput = toggle.locator('> input');
    if (initalValue) {
      await expect(toggleInput).toBeChecked();
    } else {
      await expect(toggleInput).not.toBeChecked();
    }
    await toggle.click();
  }

  async function openOptionsMenu(page: Page): Promise<Locator> {
    const optionsBtn = page.locator('#btn_options_menu');
    const optionsMenu = page.locator('.tool-bar-options-menu');
    await expect(optionsMenu).toBeHidden();
    await optionsBtn.click();
    await expect(optionsBtn).toHaveClass(ACTIVE_CSS_CLASS);
    await expect(optionsMenu).toBeVisible();
    return optionsMenu;
  }
});
