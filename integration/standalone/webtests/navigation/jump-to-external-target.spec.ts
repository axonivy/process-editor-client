import { expect, Locator, Page, test } from '@playwright/test';
import { processEditorUrl } from '../process-editor-url-util';
import { clickQuickActionStartsWith } from '../quick-actions/quick-actions-util';

test.describe('Jump to external target', () => {
  test('hd process', async ({ page }) => {
    await page.goto(procurementRequestParallelUrl());
    const hd = page.locator('#sprotty_15254DC87A1B183B-f3');
    await jumpToExternalTargetAndAssert(page, hd, '15254DF5837F8B00', '15254DF5837F8B00-f0');
  });

  test('trigger process', async ({ page }) => {
    await page.goto(triggerNewEmployeeUrl());
    const trigger = page.locator('#sprotty_15254CF1CE56AE72-f13');
    await jumpToExternalTargetAndAssert(page, trigger, '15254CF47A16DEA1', '15254CF47A16DEA1-f0');
  });

  async function jumpToExternalTargetAndAssert(page: Page, element: Locator, expectedProcessPid: string, expectedElementPid: string): Promise<void> {
    await element.click();
    await clickQuickActionStartsWith(page, 'Jump');
    await expect(element).toBeHidden();
    await page.waitForLoadState();
    expect(page.url()).toContain('pmv=workflow-demos');
    expect(page.url()).toContain(`pid=${expectedProcessPid}`);
    expect(page.url()).toContain(`selectElementIds=${expectedElementPid}`);
    await expect(page.locator(`#sprotty_${expectedElementPid}`)).toHaveAttribute('class', /selected/);
    await expect(page.locator('.sprotty-node.selected')).toHaveCount(1);
  }

  function procurementRequestParallelUrl(): string {
    return workflowDemosUrl('/processes/Humantask/ProcurementRequestParallel.p.json');
  }

  function triggerNewEmployeeUrl(): string {
    return workflowDemosUrl('/processes/Trigger/NewEmployee.p.json');
  }

  function workflowDemosUrl(file: string): string {
    return processEditorUrl('workflow-demos', file);
  }
});
