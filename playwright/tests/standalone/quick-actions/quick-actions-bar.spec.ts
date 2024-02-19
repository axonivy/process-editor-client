import { test, expect } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';

test.describe('quick actions - bar', () => {
  const BAR = '.quick-actions-bar';

  test('hide bar when edit label shortcut is pressed', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.startElement;
    await start.quickActionBar().pressShortCut('L');
    await expect(start.quickActionBar().locator()).toBeHidden();
  });

  test('hide bar when edit label is clicked', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.startElement;
    await start.quickActionBar().trigger('Edit Label', 'startsWith');
    await expect(start.quickActionBar().locator()).toBeHidden();
  });

  test('visible bar when create all elements shortcut is pressed', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.startElement;
    await start.quickActionBar().pressShortCut('A');
    await expect(start.quickActionBar().locator()).toBeVisible();
  });

  test('visible bar when events is clicked', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.startElement;
    await start.quickActionBar().trigger('Events', 'startsWith');
    await expect(page.locator(BAR)).toBeVisible();
  });
});
