import { test, expect } from '@playwright/test';

test('open process editor', async ({ page }) => {
  const baseUrl = process.env.BASE_URL + process.env.TEST_APP;

  await page.goto(process.env.BASE_URL);
  await expect(page.locator('.ui-message-warn-summary')).toContainText('Demo Mode!');

  await page.goto(baseUrl);
  await expect(page.locator('.card-header-title')).toContainText('Starts');

  await page.goto(baseUrl + '/process-editor/diagram.html?pmv=workflow-demos$1&pid=155BB4328F79B2D5');
  const toolPalette = page.locator('#sprotty_ivy-tool-palette');
  await expect(toolPalette).toBeVisible();
});
