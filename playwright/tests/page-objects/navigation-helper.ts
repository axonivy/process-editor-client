import { Page, expect } from '@playwright/test';
import { ProcessEditor } from './process-editor';

export async function jumpToExternalTargetAndAssert(
  page: Page,
  elementPid: string,
  expectedProcessPid: string,
  expectedElementPid: string
): Promise<void> {
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
