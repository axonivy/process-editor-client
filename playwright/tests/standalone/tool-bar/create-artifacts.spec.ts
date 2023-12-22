import { test } from '@playwright/test';
import { createAllElements } from './create-helper';

test.describe('tool bar - element picker', () => {
  test('create annotation', async ({ page }) => {
    await createAllElements(page, 'artifacts', 0, 1, false);
  });

  test('create lanes', async ({ page }) => {
    await createAllElements(page, 'artifacts', 1, 2, false);
  });
});
