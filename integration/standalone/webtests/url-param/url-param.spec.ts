import { test, expect } from '@playwright/test';
import { startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl, processEditorUrl } from '../process-editor-url-util';

test.describe('url parameters', () => {
  test('readonly', async ({ page }) => {
    await gotoRandomTestProcessUrl(page, '&readonly=true');
    const defaultMouseBtn = page.locator('#btn_default_tools');
    const optionsBtn = page.locator('#btn_options_menu');
    const editButtonGroup = page.locator('.edit-buttons');
    const middleButtonGroup = page.locator('.middle-buttons > span');
    await expect(defaultMouseBtn).toBeVisible();
    await expect(optionsBtn).toBeVisible();
    await expect(editButtonGroup).toBeHidden();
    await expect(middleButtonGroup).toBeHidden();
  });

  test('edit mode', async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    const defaultMouseBtn = page.locator('#btn_default_tools');
    const optionsBtn = page.locator('#btn_options_menu');
    const editButtonGroup = page.locator('.edit-buttons');
    const middleButtonGroup = page.locator('.middle-buttons > span');
    await expect(defaultMouseBtn).toBeVisible();
    await expect(optionsBtn).toBeVisible();
    await expect(editButtonGroup).toBeVisible();
    await expect(middleButtonGroup).toHaveCount(5);
  });

  test('viewer mode', async ({ page }) => {
    await gotoRandomTestProcessUrl(page, '&mode=viewer');
    const toolbar = page.locator('.ivy-tool-bar');
    const viewport = page.locator('.ivy-viewport-bar');
    const start = page.locator(startSelector);
    await expect(start).toBeVisible();
    await expect(toolbar).toBeHidden();
    await expect(viewport).toBeVisible();
  });

  test('preview mode', async ({ page }) => {
    await gotoRandomTestProcessUrl(page, '&mode=preview');
    const toolbar = page.locator('.ivy-tool-bar');
    const viewport = page.locator('.ivy-viewport-bar');
    const start = page.locator(startSelector);
    await expect(start).toBeVisible();
    await expect(toolbar).toBeHidden();
    await expect(viewport).toBeHidden();
  });

  test('zoom and highlight', async ({ page }) => {
    await page.goto(urlParamProcess() + '&zoom=321&highlight=183E49FD86C52941-f0');
    const start = page.locator(startSelector + '.executed');
    const viewport = page.locator('.ivy-viewport-bar');
    await expect(start).toBeVisible();
    await expect(viewport).toBeVisible();
    await expect(viewport).toHaveText('321%');
  });

  test('zoom and selectElementIds', async ({ page }) => {
    await page.goto(urlParamProcess() + '&zoom=123&selectElementIds=183E49FD86C52941-f0');
    const start = page.locator(startSelector + '.selected');
    const viewport = page.locator('.ivy-viewport-bar');
    await expect(start).toBeVisible();
    await expect(viewport).toBeVisible();
    await expect(viewport).toHaveText('123%');
  });

  test('theme light', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(urlParamProcess());
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.goto(urlParamProcess() + '&theme=light');
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('theme dark', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(urlParamProcess());
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.goto(urlParamProcess() + '&theme=dark');
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  function urlParamProcess(): string {
    return testProjectUrl('/processes/urlparam.p.json');
  }

  function testProjectUrl(file: string): string {
    return processEditorUrl('glsp-test-project', file);
  }
});
