import { test } from '@playwright/test';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { assertElementPaletteHidden, createAllElements } from '../toolbar-util';

test.describe('tool bar - element picker', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await assertElementPaletteHidden(page);
  });

  test('create all gateways', async ({ page }) => {
    await createAllElements(page, 'gateways', 0, 4);
  });
});
