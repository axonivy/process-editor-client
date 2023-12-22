import { test } from '@playwright/test';
import { createAllElements } from './create-helper';

test.describe('tool bar - element picker', () => {
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
