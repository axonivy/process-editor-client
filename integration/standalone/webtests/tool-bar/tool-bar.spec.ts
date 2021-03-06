import { test, expect, Page, Locator } from '@playwright/test';
import { removeElement, resetSelection, startSelector } from '../diagram-util';
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

  test('menus show / hide', async ({ page }) => {
    const optionsBtn = page.locator('#btn_options_menu');
    const eventsBtn = page.locator('#btn_events_menu');
    const gatewaysBtn = page.locator('#btn_gateways_menu');
    const optionsMenu = page.locator('.tool-bar-options-menu');
    const elementsMenu = page.locator('.tool-bar-menu');
    await assertNoOpenMenu(page, optionsMenu, elementsMenu);
    await openMenuAndAssert(optionsBtn, optionsMenu, elementsMenu);

    await optionsBtn.click();
    await assertNoOpenMenu(page, optionsMenu, elementsMenu);
    await openMenuAndAssert(optionsBtn, optionsMenu, elementsMenu);
    await openMenuAndAssert(eventsBtn, elementsMenu, optionsMenu);
    await openMenuAndAssert(gatewaysBtn, elementsMenu, optionsMenu);

    await gatewaysBtn.click();
    await assertNoOpenMenu(page, optionsMenu, elementsMenu);
  });

  test('menus close on focus loose', async ({ page }) => {
    const optionsBtn = page.locator('#btn_options_menu');
    const eventsBtn = page.locator('#btn_events_menu');
    const optionsMenu = page.locator('.tool-bar-options-menu');
    const elementsMenu = page.locator('.tool-bar-menu');
    await assertNoOpenMenu(page, optionsMenu, elementsMenu);
    await openMenuAndAssert(optionsBtn, optionsMenu, elementsMenu);

    await page.locator(startSelector).click();
    await assertNoOpenMenu(page, optionsMenu, elementsMenu);
    await openMenuAndAssert(optionsBtn, optionsMenu, elementsMenu);
    await openMenuAndAssert(eventsBtn, elementsMenu, optionsMenu);

    await resetSelection(page);
    await assertNoOpenMenu(page, optionsMenu, elementsMenu);
    await openMenuAndAssert(eventsBtn, elementsMenu, optionsMenu);
  });

  async function assertNoOpenMenu(page: Page, optionsMenu: Locator, elementsMenu: Locator): Promise<void> {
    await expect(page.locator(DEFAULT_TOOL)).toHaveClass(ACTIVE_CSS_CLASS);
    await expect(optionsMenu).toBeHidden();
    await expect(elementsMenu).toBeHidden();
  }

  async function openMenuAndAssert(activeButton: Locator, openMenu: Locator, closedMenu: Locator): Promise<void> {
    await activeButton.click();
    await expect(activeButton).toHaveClass(ACTIVE_CSS_CLASS);
    await expect(openMenu).toBeVisible();
    await expect(closedMenu).toBeHidden();
  }

  test('options - toggle theme', async ({ page }) => {
    const graph = page.locator('.sprotty-graph');
    await expect(graph).toHaveCSS('background-color', 'rgb(250, 250, 250)');

    const menu = await openOptionsMenu(page);
    await toggleOption(menu, 'Darkmode', false);
    await expect(graph).toHaveCSS('background-color', 'rgb(60, 59, 58)');

    await toggleOption(menu, 'Darkmode', true);
    await expect(graph).toHaveCSS('background-color', 'rgb(250, 250, 250)');
  });

  test('options - toggle grid', async ({ page }) => {
    const grid = page.locator('.grid');
    await expect(grid).toBeHidden();

    const menu = await openOptionsMenu(page);
    await toggleOption(menu, 'Grid', false);
    await expect(grid).toBeVisible();

    await toggleOption(menu, 'Grid', true);
    await expect(grid).toBeHidden();
  });

  test('options - toggle custom icons', async ({ page }) => {
    const menu = await openOptionsMenu(page);
    await toggleOption(menu, 'Custom Icon', true);
    await toggleOption(menu, 'Custom Icon', false);
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
