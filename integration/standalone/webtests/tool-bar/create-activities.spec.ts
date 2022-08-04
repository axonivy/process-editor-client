import { test } from '@playwright/test';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { assertElementPaletteHidden, createAllElements } from '../toolbar-util';

test.describe('tool bar - element picker', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await assertElementPaletteHidden(page);
  });

  test('create all workflow activities', async ({ page }) => {
    await createAllElements(page, 'activities', 0, 6);
  });

  test('create all interface activities', async ({ page }) => {
    await createAllElements(page, 'activities', 1, 6);
  });

  test('create all bpmn activities', async ({ page }) => {
    await createAllElements(page, 'activities', 2, 8);
  });
});
