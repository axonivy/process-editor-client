import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';

test.describe('diagram', () => {
  test('element resize handles', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const element = await processEditor.createActivity('User Dialog', { x: 300, y: 200 });
    await processEditor.resetSelection();
    await element.expectResizeHandles(0);
    await element.select();
    await element.expectResizeHandles(4);
  });

  test('lane handles', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const lane = await processEditor.createLane({ x: 10, y: 100 });
    await lane.expectResizeHandles(0);
    await lane.select();
    await lane.expectResizeHandles(2);
  });

  test('increase element size using bottom-right handle', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const element = await processEditor.createActivity('Sub', { x: 300, y: 200 });
    await processEditor.resetSelection();
    await element.select();

    const bottomRightHandle = element.getResizeHandle('bottom-right');
    const bottomRightHandleBounds = await bottomRightHandle.boundingBox();
    const topLeftHandle = element.getResizeHandle('top-left');
    const topLeftHandleBounds = await topLeftHandle.boundingBox();

    expect(await element.locator().boundingBox()).toStrictEqual({ x: 234.5, y: 165.5, height: 69, width: 121 });

    await bottomRightHandle.hover();
    await page.mouse.down();
    await page.mouse.move((await bottomRightHandle.boundingBox())!.x + 300, (await bottomRightHandle.boundingBox())!.y + 150);
    await page.mouse.up();

    await processEditor.resetSelection();
    await element.select();

    expect(await element.locator().boundingBox()).toStrictEqual({ x: 234.5, y: 165.5, height: 213, width: 417 });
    expect(topLeftHandleBounds).toStrictEqual(await topLeftHandle.boundingBox());
    expect(await bottomRightHandle.boundingBox()).toStrictEqual({
      x: bottomRightHandleBounds!.x + 296,
      y: bottomRightHandleBounds!.y + 144,
      height: bottomRightHandleBounds?.height,
      width: bottomRightHandleBounds?.width
    });
  });
});
