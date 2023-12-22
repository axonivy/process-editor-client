import { test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';

test.describe('diagram', () => {
  test('open process editor', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const toolPalette = processEditor.toolbar();
    await toolPalette.visible();
  });
});
