import { test, expect } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';

test.describe('tool bar', () => {
  test('switch tool', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const toolbar = processEditor.toolbar();
    await toolbar.triggerDefault();
    await toolbar.triggerMarquee();
    await toolbar.triggerDefault();
  });

  test('undo / redo', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.element('start:requestStart');
    await expect(start.locator()).toBeVisible();

    await start.delete();
    await expect(start.locator()).toBeHidden();

    await processEditor.toolbar().triggerUndo();
    await expect(start.locator()).toBeVisible();

    await processEditor.toolbar().triggerRedo();
    await expect(start.locator()).toBeHidden();
  });

  test('search', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const menu = await processEditor.toolbar().openElementPalette('all_elements');
    await menu.expectMenuGroupCount(9);

    await menu.search('ta');
    await menu.expectMenuGroupCount(5);
    await menu.expectMenuItemCount(8);

    await menu.search('bla');
    await menu.expectMenuGroupCount(0);
    await menu.expectMenuItemCount(0);
    await expect(menu.emptyResult()).toBeVisible();
    await expect(menu.emptyResult()).toHaveText('No results found.');

    await page.keyboard.press('Escape');
    await expect(menu.searchInput()).toBeEmpty();
    await menu.expectMenuGroupCount(9);
  });
});
