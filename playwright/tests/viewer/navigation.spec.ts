import { test } from '@playwright/test';
import { jumpToExternalTargetAndAssert } from '../standalone/navigation/jump-to-external-target.spec';

test.describe('Jump to external target', () => {
  test('hd process with viewer', async ({ page }) => {
    await jumpToExternalTargetAndAssert(page, '183E4A356E771204-f5', '183E4A455276AFC5', '183E4A455276AFC5-f0');
  });
});
