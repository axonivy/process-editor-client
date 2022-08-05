import { test } from '@playwright/test';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { assertElementPaletteHidden, createAllElements } from '../toolbar-util';

test.describe('tool bar - element picker', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await assertElementPaletteHidden(page);
  });

  test('create annotation', async ({ page }) => {
    await createAllElements(page, 'artifacts', 0, 1, false);
  });

  test('create lanes', async ({ page }) => {
    await createAllElements(page, 'artifacts', 1, 2, false);
  });
});
