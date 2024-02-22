import { test } from '@playwright/test';
import { createAllElements } from './create-helper';

test.describe('tool bar - element picker', () => {
  test('create all workflow activities', async ({ page }) => {
    await createAllElements(page, 'activities', 0, 5);
  });

  test('create all interface activities', async ({ page }) => {
    await createAllElements(page, 'activities', 1, 6);
  });

  test('create all bpmn activities', async ({ page }) => {
    await createAllElements(page, 'activities', 2, 8);
  });
});
