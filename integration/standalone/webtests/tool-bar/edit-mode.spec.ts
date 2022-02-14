import { test, expect } from '@playwright/test';
import { procurementRequestParallelUrl } from '../process-editor-url-util';

test.describe('tool bar - edit mode', () => {
  test('readonly', async ({ page }) => {
    await page.goto(procurementRequestParallelUrl() + '&readonly=true');
    const defaultMouseToolBtn = page.locator('#btn_default_tools');
    const elementPickerTools = page.locator('.element-pickers');
    await expect(defaultMouseToolBtn).toBeVisible();
    await expect(elementPickerTools).not.toBeVisible();
  });

  test('edit mode', async ({ page }) => {
    await page.goto(procurementRequestParallelUrl());
    const defaultMouseToolBtn = page.locator('#btn_default_tools');
    const elementPickerTools = page.locator('.element-pickers');
    await expect(defaultMouseToolBtn).toBeVisible();
    await expect(elementPickerTools).toBeVisible();
  });
});
