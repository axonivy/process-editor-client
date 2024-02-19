import { test, expect } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';

test.describe('Dirty state', () => {
  test('tab name of dirty model', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const title = await page.title();
    expect(title).toContain('.p.json');
    expect(title).not.toContain('*');

    await processEditor.startElement.delete();
    expect(await page.title()).toBe('* ' + title);
  });
});
