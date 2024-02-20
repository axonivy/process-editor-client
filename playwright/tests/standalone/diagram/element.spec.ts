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
    await element.expectPosition({ x: 240, y: 122 });
    await element.expectSize(121, 69);
    await element.resize(bottomRightHandle, { x: 800, y: 700 });
    await processEditor.resetSelection();
    await element.select();
    await element.expectPosition({ x: 240, y: 122 });
    await element.expectSize(569, 541);
    expect(topLeftHandleBounds).toStrictEqual(await topLeftHandle.boundingBox());
    expect(bottomRightHandleBounds).not.toStrictEqual(await bottomRightHandle.boundingBox());
  });

  test('decrease element size using top-left handle', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const element = await processEditor.createActivity('Sub', { x: 300, y: 200 });
    await processEditor.resetSelection();
    await element.select();
    const bottomRightHandle = element.getResizeHandle('bottom-right');
    const bottomRightHandleBounds = await bottomRightHandle.boundingBox();
    const topLeftHandle = element.getResizeHandle('top-left');
    const topLeftHandleBounds = await topLeftHandle.boundingBox();
    await element.expectPosition({ x: 240, y: 122 });
    await element.expectSize(121, 69);
    await element.resize(topLeftHandle, { x: 300, y: 200 });
    await processEditor.resetSelection();
    await element.select();
    await element.expectPosition({ x: 304, y: 154 });
    await element.expectSize(57, 37);
    expect(bottomRightHandleBounds).toStrictEqual(await bottomRightHandle.boundingBox());
    expect(topLeftHandleBounds).not.toStrictEqual(await topLeftHandle.boundingBox());
  });
});
