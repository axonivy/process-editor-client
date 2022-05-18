import { test, expect } from '@playwright/test';
import { cleanDiagram, startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test.describe('dirty state', () => {
  test('tab name of dirty model', async ({ page }) => {
    const start = page.locator(startSelector);
    await gotoRandomTestProcessUrl(page);
    const title = await page.title();
    expect(title).toContain('.p.json');
    expect(title).not.toContain('*');

    await cleanDiagram(page);
    await expect(start).toBeHidden();
    expect(await page.title()).toBe('* ' + title);
  });
});
