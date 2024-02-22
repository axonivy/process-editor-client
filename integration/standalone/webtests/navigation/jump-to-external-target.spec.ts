import { expect, Locator, Page, test } from '@playwright/test';
import { processEditorUrl } from '../process-editor-url-util';
import { clickQuickActionStartsWith } from '../quick-actions/quick-actions-util';
import { assertGraphNotOriginViewport, assertGraphOriginViewport } from '../viewport/viewport-util';

test.describe('Jump to external target', () => {
  test('hd process', async ({ page }) => {
    await page.goto(jumpProcess());
    const hd = page.locator('#sprotty_183E4A356E771204-f5');
    await jumpToExternalTargetAndAssert(page, hd, '183E4A455276AFC5', '183E4A455276AFC5-f0');
  });

  test('trigger process', async ({ page }) => {
    await page.goto(jumpProcess());
    const trigger = page.locator('#sprotty_183E4A356E771204-f3');
    await jumpToExternalTargetAndAssert(page, trigger, '1842D6FBB6A107AB', '1842D6FBB6A107AB-f0');
  });

  test('sub process', async ({ page }) => {
    await page.goto(jumpProcess());
    const callSub = page.locator('#sprotty_183E4A356E771204-f6');
    await jumpToExternalTargetAndAssert(page, callSub, '183E4A4179C3C69B', '183E4A4179C3C69B-f0');
  });

  test('embedded process', async ({ page }) => {
    await page.goto(jumpProcess());
    const centerBtn = page.locator('#centerBtn');
    const jumpOutBtn = page.locator('#sprotty_jumpOutUi .jump-out-btn i');
    const embedded = page.locator('#sprotty_183E4A356E771204-S10');
    const script = page.locator('#sprotty_183E4A356E771204-S10-f9');
    await assertGraphOriginViewport(page);

    await embedded.click();
    await centerBtn.click();
    await assertGraphNotOriginViewport(page);

    await clickQuickActionStartsWith(page, 'Jump');
    await expect(script).toBeVisible();
    await assertGraphOriginViewport(page);
    await expect(jumpOutBtn).toBeVisible();

    await jumpOutBtn.click();
    await expect(script).toBeHidden();
    await expect(embedded).toBeVisible();
    await assertGraphNotOriginViewport(page);
  });

  async function jumpToExternalTargetAndAssert(page: Page, element: Locator, expectedProcessPid: string, expectedElementPid: string): Promise<void> {
    await element.click();
    await clickQuickActionStartsWith(page, 'Jump');
    await expect(element).toBeHidden();
    await page.waitForLoadState();
    expect(page.url()).toContain('pmv=glsp-test-project');
    expect(page.url()).toContain(`pid=${expectedProcessPid}`);
    expect(page.url()).toContain(`selectElementIds=${expectedElementPid}`);
    await expect(page.locator(`#sprotty_${expectedElementPid}`)).toHaveAttribute('class', /selected/);
    await expect(page.locator('.sprotty-node.selected')).toHaveCount(1);
  }

  function jumpProcess(): string {
    return testProjectUrl('/processes/jump.p.json');
  }

  function testProjectUrl(file: string): string {
    return processEditorUrl('glsp-test-project', file);
  }
});
