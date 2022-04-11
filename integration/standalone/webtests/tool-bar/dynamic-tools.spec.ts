import { test, expect } from '@playwright/test';
import { multiSelect } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';

test.describe('tool bar - dynamic tools', () => {
  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
  });

  test('delete', async ({ page }) => {
    const dynamicTools = page.locator('.dynamic-tools');
    const startElement = page.locator('.sprotty-graph .start');
    const deleteBtn = dynamicTools.locator('span[title=Delete]');
    await expect(dynamicTools).not.toBeVisible();
    await startElement.click();

    await expect(dynamicTools).toBeVisible();
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    await expect(startElement).not.toBeVisible();
  });

  test('wrap single to sub', async ({ page }) => {
    const dynamicTools = page.locator('.dynamic-tools');
    const startElement = page.locator('.sprotty-graph .start');
    const wrapToSubBtn = dynamicTools.locator('span[title^=Wrap]');
    const embeddedElements = page.locator('.embeddedproc');
    await expect(dynamicTools).not.toBeVisible();
    await expect(embeddedElements).toHaveCount(0);
    await startElement.click();

    await expect(dynamicTools).toBeVisible();
    await expect(wrapToSubBtn).toBeVisible();
    await wrapToSubBtn.click();

    await expect(startElement).not.toBeVisible();
    await expect(embeddedElements).toHaveCount(1);
  });

  test('wrap multi to sub', async ({ page, browserName }) => {
    const dynamicTools = page.locator('.dynamic-tools');
    const startElement = page.locator('.sprotty-graph .start');
    const endElement = page.locator('.sprotty-graph .end');
    const wrapToSubBtn = dynamicTools.locator('span[title^=Wrap]');
    const embeddedElements = page.locator('.embeddedproc');
    await expect(dynamicTools).not.toBeVisible();
    await expect(embeddedElements).toHaveCount(0);

    await multiSelect(page, [startElement, endElement], browserName);

    await expect(dynamicTools).toBeVisible();
    await expect(wrapToSubBtn).toBeVisible();
    await wrapToSubBtn.click();

    await expect(startElement).not.toBeVisible();
    await expect(endElement).not.toBeVisible();
    await expect(embeddedElements).toHaveCount(1);
  });

  test('autoalign', async ({ page, browserName }) => {
    const dynamicTools = page.locator('.dynamic-tools');
    const startElement = page.locator('.sprotty-graph .start');
    const endElement = page.locator('.sprotty-graph .end');
    const autoAlignBtn = dynamicTools.locator('span[title^=Auto]');
    await expect(dynamicTools).not.toBeVisible();

    await endElement.dragTo(page.locator('.sprotty-graph'));
    const startElementTransform = await startElement.getAttribute('transform');
    const endElementTransform = await endElement.getAttribute('transform');

    await multiSelect(page, [startElement, endElement], browserName);

    await expect(dynamicTools).toBeVisible();
    await expect(autoAlignBtn).toBeVisible();
    await autoAlignBtn.click();

    await expect(startElement).toHaveAttribute('transform', startElementTransform);
    await expect(endElement).not.toHaveAttribute('transform', endElementTransform);
    // end element should only be moved vertically
    await expect(endElement).toHaveAttribute('transform', /translate\(625, \d+\)/);
  });
});
