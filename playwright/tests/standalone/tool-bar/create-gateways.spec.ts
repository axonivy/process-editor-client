import { test } from '@playwright/test';
import { createAllElements } from './create-helper';

test.describe('tool bar - element picker', () => {
  test('create all gateways', async ({ page }) => {
    await createAllElements(page, 'gateways', 0, 4);
  });
});
