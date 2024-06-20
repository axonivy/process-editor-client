import { Page, expect } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';
import { ElementPaletteGroup } from '../../page-objects/toolbar';
import { graphLocator } from '../../page-objects/graph';

export async function createAllElements(
  page: Page,
  btn: ElementPaletteGroup,
  groupIndex: number,
  expectedElementCount: number,
  checkSelection = true
) {
  const processEditor = await ProcessEditor.openEmptyProcess(page);
  await processEditor.toolbar().openElementPalette(btn);
  const menu = processEditor.toolbar().menu().locator();

  const graph = graphLocator(page);
  const elements = graph.locator('> g > g');
  const pickers = menu.locator('.menu-group-items').nth(groupIndex).locator('.menu-item');
  const pickersCount = await pickers.count();
  for (let i = 0; i < pickersCount; i++) {
    await pickers.nth(i).click();
    await graph.click({ position: { x: 80 + 80 * i, y: 100 } });
    await expect(elements).toHaveCount(i + 1);
    if (checkSelection) {
      await expect(elements.last()).toHaveAttribute('class', /selected/);
    }
    await processEditor.resetSelection();
    await processEditor.toolbar().openElementPalette(btn);
  }
  await expect(elements).toHaveCount(expectedElementCount);
}
