import { test } from '@playwright/test';
import { jumpToExternalTargetAndAssert } from '../page-objects/navigation-helper';

test('sub process with viewer', async ({ page }) => {
  await jumpToExternalTargetAndAssert(page, '183E4A356E771204-f6', '183E4A4179C3C69B', '183E4A4179C3C69B-f0');
});
