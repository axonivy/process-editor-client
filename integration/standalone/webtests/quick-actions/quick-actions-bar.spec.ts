import { test, expect } from '@playwright/test';
import { startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { clickQuickActionEndsWith } from './quick-actions-util';

test.describe('quick actions - bar', () => {
  const BAR = '.quick-actions-bar';

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await page.locator(startSelector).click();
    await expect(page.locator(BAR)).toBeVisible();
  });

  test('hide bar when edit label shortcut is pressed', async ({ page }) => {
    await page.keyboard.press('L');
    await expect(page.locator(BAR)).toBeHidden();
  });

  test('hide bar when edit label is clicked', async ({ page }) => {
    await clickQuickActionEndsWith(page, 'Label (L)');
    await expect(page.locator(BAR)).toBeHidden();
  });

  test('visible bar when create all elements shortcut is pressed', async ({ page }) => {
    await page.keyboard.press('A');
    await expect(page.locator(BAR)).toBeVisible();
  });

  test('visible bar when events is clicked', async ({ page }) => {
    await clickQuickActionEndsWith(page, 'Events (A)');
    await expect(page.locator(BAR)).toBeVisible();
  });
});
