import { BrowserContext, expect, Page, test } from '@playwright/test';
import { procurementRequestParallelUrl, triggerNewEmployeeUrl } from '../process-editor-url-util';

test.describe('Jump to external target', () => {
  test('hd process', async ({ page, context }) => {
    await page.goto(procurementRequestParallelUrl());
    await page.locator('#sprotty_15254DC87A1B183B-f3').click();
    await jumpToExternalTargetAndAssert(page, context, '15254DF5837F8B00', '15254DF5837F8B00-f0');
  });

  test('trigger process', async ({ page, context }) => {
    await page.goto(triggerNewEmployeeUrl());
    await page.locator('#sprotty_15254CF1CE56AE72-f13').click();
    await jumpToExternalTargetAndAssert(page, context, '15254CF47A16DEA1', '15254CF47A16DEA1-f0');
  });

  async function jumpToExternalTargetAndAssert(page: Page, context: BrowserContext, expectedProcessPid: string, expectedElementPid: string): Promise<void> {
    const [newPage] = await Promise.all([context.waitForEvent('page'), page.click('#sprotty_quickActionsUi i[title="Jump (J)"]')]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('pmv=workflow-demos');
    expect(newPage.url()).toContain(`pid=${expectedProcessPid}`);
    expect(newPage.url()).toContain(`selectElementIds=${expectedElementPid}`);
    await expect(newPage.locator(`#sprotty_${expectedElementPid}`)).toHaveAttribute('class', /selected/);
    await expect(newPage.locator('.sprotty-node.selected')).toHaveCount(1);
  }
});
