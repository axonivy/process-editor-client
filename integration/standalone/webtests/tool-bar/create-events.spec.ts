import { test } from '@playwright/test';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { assertElementPaletteHidden, createAllElements } from '../toolbar-util';

test.describe('tool bar - element picker', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
    await assertElementPaletteHidden(page);
  });

  test('create all start events', async ({ page }) => {
    await createAllElements(page, 'events', 0, 4);
  });

  test('create all intermediate events', async ({ page }) => {
    await createAllElements(page, 'events', 1, 2);
  });

  test('create all end events', async ({ page }) => {
    await createAllElements(page, 'events', 2, 3);
  });
});
