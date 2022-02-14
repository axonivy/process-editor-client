import { test, expect } from '@playwright/test';
import { procurementRequestParallelUrl } from './process-editor-url-util';

test('open process editor', async ({ page }) => {
  await page.goto(procurementRequestParallelUrl());
  const toolPalette = page.locator('#sprotty_ivy-tool-palette');
  await expect(toolPalette).toBeVisible();
});
