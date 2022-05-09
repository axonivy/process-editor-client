import { expect, Locator, Page, test } from '@playwright/test';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { editLabel } from '../quick-actions/quick-actions-util';
import { getCtrl, startSelector } from '../diagram-util';

test.describe('key listener - save', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
  });

  test('label edit and save', async ({ page, browserName }) => {
    const text = 'test label';
    const start = page.locator(startSelector);

    editNodeLabel(page, start, text);
    page.reload();
    await expect(start.locator('.sprotty-label div')).toHaveText('start.ivp');

    editNodeLabel(page, start, text);
    await page.keyboard.press(`${getCtrl(browserName)}+S`);
    page.reload();
    await expect(start.locator('.sprotty-label div')).toHaveText(text);
  });

  async function editNodeLabel(page: Page, node: Locator, text: string): Promise<void> {
    editLabel(page, node, text);
    await expect(node.locator('.sprotty-label div')).toHaveText(text);
  }
});
