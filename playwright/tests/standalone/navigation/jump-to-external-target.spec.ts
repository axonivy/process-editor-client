import { expect, Page, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';

test.describe('Jump to external target', () => {
  test('hd process', async ({ page }) => {
    await jumpToExternalTargetAndAssert(page, '183E4A356E771204-f5', '183E4A455276AFC5', '183E4A455276AFC5-f0');
  });

  test('trigger process', async ({ page }) => {
    await jumpToExternalTargetAndAssert(page, '183E4A356E771204-f3', '1842D6FBB6A107AB', '1842D6FBB6A107AB-f0');
  });

  test('sub process', async ({ page }) => {
    await jumpToExternalTargetAndAssert(page, '183E4A356E771204-f6', '183E4A4179C3C69B', '183E4A4179C3C69B-f0');
  });

  test('embedded process', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page, { file: '/processes/jump.p.json' });
    const viewport = processEditor.viewport();
    const jumpOutBtn = processEditor.jumpOut();
    const embedded = processEditor.elementByPid('183E4A356E771204-S10');
    const script = processEditor.elementByPid('183E4A356E771204-S10-f9');
    await viewport.expectGraphOriginViewport();

    await embedded.select();
    await viewport.triggerCenter();
    await viewport.expectGraphNotOriginViewport();

    await embedded.quickActionBar().trigger('Jump', 'startsWith');
    await expect(script.locator()).toBeVisible();
    await viewport.expectGraphOriginViewport();
    await jumpOutBtn.expectVisible();

    await jumpOutBtn.click();
    await expect(script.locator()).toBeHidden();
    await expect(embedded.locator()).toBeVisible();
    await viewport.expectGraphNotOriginViewport();
  });
});

export async function jumpToExternalTargetAndAssert(page: Page, elementPid: string, expectedProcessPid: string, expectedElementPid: string): Promise<void> {
  const processEditor = await ProcessEditor.openProcess(page, { file: '/processes/jump.p.json' });
  const element = processEditor.elementByPid(elementPid);
  await element.quickActionBar().trigger('Jump', 'startsWith');
  await expect(element.locator()).toBeHidden();
  await page.waitForLoadState();
  expect(page.url()).toContain('pmv=glsp-test-project');
  expect(page.url()).toContain(`pid=${expectedProcessPid}`);
  expect(page.url()).toContain(`select=${expectedElementPid}`);
  await processEditor.elementByPid(expectedElementPid).expectSelected();
}
