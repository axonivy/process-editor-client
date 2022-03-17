import { expect, test } from '@playwright/test';
import { multiSelect, getCtrl } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test.describe('key listener - copy paste', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
  });

  test('copy node', async ({ page, browserName }) => {
    const start = page.locator('.sprotty-graph .start');
    await expect(start).toHaveCount(1);
    await start.click();
    await page.keyboard.press(`${getCtrl(browserName)}+C`);
    await page.keyboard.press(`${getCtrl(browserName)}+V`);
    await expect(start).toHaveCount(2);
  });

  test('copy multiple nodes', async ({ page, browserName }) => {
    const start = page.locator('.sprotty-graph .start');
    const end = page.locator('.sprotty-graph .end');
    const connectors = page.locator('.sprotty-graph > g > .sprotty-edge');
    await expect(start).toHaveCount(1);
    await expect(end).toHaveCount(1);
    await expect(connectors).toHaveCount(1);
    await multiSelect(page, [start, end], browserName);
    await page.keyboard.press(`${getCtrl(browserName)}+C`);
    await page.keyboard.press(`${getCtrl(browserName)}+V`);
    await expect(start).toHaveCount(2);
    await expect(end).toHaveCount(2);
    await expect(connectors).toHaveCount(2);
  });
});
