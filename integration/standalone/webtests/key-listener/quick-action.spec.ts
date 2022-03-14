import { expect, test } from '@playwright/test';
import { resetSelection, multiSelect } from '../diagram-util';
import { randomTestProcessUrl } from '../process-editor-url-util';

test.describe('quick action shortcuts', () => {
  const STRAIGHT_CONNECTOR_PATH = /M \d+.?\d*,\d+.?\d* L \d+.?\d*,\d+.?\d*/;
  const BEND_CONNECTOR_PATH = /M \d+,\d+ L \d+,\d+ L \d+,\d+ L \d+,\d+/;

  test.beforeEach(async ({ page }) => {
    await page.goto(randomTestProcessUrl());
  });

  test('connector bend and straigthen', async ({ page }) => {
    const endElement = page.locator('.sprotty-graph .end');
    await endElement.dragTo(page.locator('.sprotty-graph'));
    const connector = page.locator('.sprotty-graph > g > .sprotty-edge');
    const connectorPath = page.locator('.sprotty-graph > g > .sprotty-edge > path').first();
    await expect(connectorPath).toHaveAttribute('d', STRAIGHT_CONNECTOR_PATH);

    await resetSelection(page);
    await connector.click();
    await page.keyboard.press('b');
    await expect(connectorPath).toHaveAttribute('d', BEND_CONNECTOR_PATH);

    await resetSelection(page);
    await connector.click();
    await page.keyboard.press('S');
    await expect(connectorPath).toHaveAttribute('d', STRAIGHT_CONNECTOR_PATH);
  });

  test('label edit', async ({ page, browserName }) => {
    const label = page.locator('.label-edit textarea');
    const start = page.locator('.sprotty-graph .start');
    await expect(start.locator('.sprotty-label div')).toHaveText('start.ivp');
    await !expect(label).toBeVisible();

    await start.click();
    await page.keyboard.press('L');
    await expect(label).toBeVisible();
    await page.keyboard.press('Control+A');
    await page.keyboard.type('test label');
    await page.keyboard.press('Enter');
    await expect(start.locator('.sprotty-label div')).toHaveText('test label');
  });

  test('auto align', async ({ page, browserName }) => {
    const start = page.locator('.sprotty-graph .start');
    const end = page.locator('.sprotty-graph .end');
    await end.dragTo(page.locator('.sprotty-graph'));
    const startTransform = await start.getAttribute('transform');
    const endTransform = await end.getAttribute('transform');

    await multiSelect(page, [start, end], browserName);
    await page.keyboard.press('A');
    await expect(start).toHaveAttribute('transform', startTransform);
    await expect(end).not.toHaveAttribute('transform', endTransform);
    // end element should only be moved vertically
    await expect(end).toHaveAttribute('transform', /translate\(625, \d+\)/);
  });
});
