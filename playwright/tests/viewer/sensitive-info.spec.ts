import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../page-objects/process-editor';

test('no info on edges', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  await processEditor.edge().select();
  await expect(processEditor.edge().quickActionBar().locator()).toBeHidden();
  await processEditor.startElement.select();
  await expect(processEditor.startElement.quickActionBar().locator()).toBeVisible();
});
