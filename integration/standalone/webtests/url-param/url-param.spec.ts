import { test, expect } from '@playwright/test';
import { startSelector } from '../diagram-util';
import { procurementRequestParallelUrl } from '../process-editor-url-util';

test.describe('url parameters', () => {
  test('viewer mode', async ({ page }) => {
    await page.goto(procurementRequestParallelUrl() + '&mode=viewer');
    const toolbar = page.locator('.ivy-tool-bar');
    const viewport = page.locator('.ivy-viewport-bar');
    await expect(toolbar).not.toBeVisible();
    await expect(viewport).toBeVisible();
  });

  test('preview mode', async ({ page }) => {
    await page.goto(procurementRequestParallelUrl() + '&mode=preview');
    const toolbar = page.locator('.ivy-tool-bar');
    const viewport = page.locator('.ivy-viewport-bar');
    await expect(toolbar).not.toBeVisible();
    await expect(viewport).not.toBeVisible();
  });

  test('zoom and highlight', async ({ page }) => {
    await page.goto(procurementRequestParallelUrl() + '&zoom=321&highlight=15254DC87A1B183B-f0');
    const start = page.locator(startSelector + '.executed');
    const viewport = page.locator('.ivy-viewport-bar');
    await expect(start).toBeVisible();
    await expect(viewport).toBeVisible();
    await expect(viewport).toHaveText('321%');
  });

  test('zoom and selectElementIds', async ({ page }) => {
    await page.goto(procurementRequestParallelUrl() + '&zoom=123&selectElementIds=15254DC87A1B183B-f0');
    const start = page.locator(startSelector + '.selected');
    const viewport = page.locator('.ivy-viewport-bar');
    await expect(start).toBeVisible();
    await expect(viewport).toBeVisible();
    await expect(viewport).toHaveText('123%');
  });
});
