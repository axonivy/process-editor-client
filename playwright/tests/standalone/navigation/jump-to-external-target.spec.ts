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

  async function jumpToExternalTargetAndAssert(page: Page, elementPid: string, expectedProcessPid: string, expectedElementPid: string): Promise<void> {
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
});
