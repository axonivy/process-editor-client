import { test, expect } from '@playwright/test';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test('open process editor', async ({ page }) => {
  await gotoRandomTestProcessUrl(page);
  const toolPalette = page.locator('#sprotty_ivy-tool-bar');
  await expect(toolPalette).toBeVisible();
});
