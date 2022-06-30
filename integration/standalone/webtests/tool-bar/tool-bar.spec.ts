import { test, expect } from '@playwright/test';
import { startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test.describe('tool bar - default tools', () => {
  const DEFAULT_TOOL = '#btn_default_tools';
  const MARQUEE_TOOL = '#btn_marquee_tools';

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await expect(page.locator('.bar-header > .header-tools >> nth=0')).toBeVisible();
    await expect(page.locator(startSelector)).toBeVisible();
  });

  test('switch tool', async ({ page }) => {
    const ACTIVE_CSS_CLASS = /clicked/;
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

  test('custom icon toggle', async ({ page }) => {
    const BTN_ACTIVE_CSS_CLASS = /active/;
    const toggleCustomIconBtn = page.locator('#btn_toggle_custom_icons');
    await expect(toggleCustomIconBtn).toHaveClass(BTN_ACTIVE_CSS_CLASS);

    await toggleCustomIconBtn.click();
    await expect(toggleCustomIconBtn).not.toHaveClass(BTN_ACTIVE_CSS_CLASS);
    await expect(page.locator(startSelector)).toBeVisible();
  });
});
