import { test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';

test.describe('options', () => {
  test('toggle theme', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    await processEditor.expectLightMode();

    await processEditor.toolbar().openOptionsMenu();
    await processEditor.toolbar().options().toggleOption('Darkmode', false);
    await processEditor.expectDarkMode();

    await processEditor.toolbar().options().toggleOption('Darkmode', true);
    await processEditor.expectLightMode();
  });

  test('toggle grid', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    await processEditor.expectGridHidden();

    await processEditor.toolbar().openOptionsMenu();
    await processEditor.toolbar().options().toggleOption('Grid', false);
    await processEditor.expectGridVisible();

    await processEditor.toolbar().options().toggleOption('Grid', true);
    await processEditor.expectGridHidden();
  });

  test('toggle custom icons', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    await processEditor.toolbar().openOptionsMenu();
    await processEditor.toolbar().options().toggleOption('Custom Icon', true);
    await processEditor.toolbar().options().toggleOption('Custom Icon', false);
  });
});
