import test, { expect } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('focus tool bar shortcut', async ({ page }) => {
  await ProcessEditor.openProcess(page);
  const defaultToolsButton = page.locator('#btn_default_tools');
  await expect(defaultToolsButton).not.toBeFocused();
  await page.keyboard.press('Digit1');
  await expect(defaultToolsButton).toBeFocused();
});

test('focus diagram shortcut', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page);
  await expect(editor.diagram).not.toBeFocused();
  await editor.focusDiagramAndCheck();
});

test('toggle and focus inscription shortcut', async ({ page }) => {
  const inscription = (await ProcessEditor.openProcess(page)).inscription();
  await inscription.expectClosed();
  await page.keyboard.press('Digit3');
  await inscription.expectOpen();
  await page.keyboard.press('Digit3');
  await expect(inscription.locator().locator('button').first()).toBeFocused();
});

test('resize inscription shortcut', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page);
  const inscriptionView = (await editor.startElement.inscribe()).view;
  const originalBounds = await inscriptionView.boundingBox();
  await inscriptionView.locator('div.inscription-resizer').focus();
  await page.keyboard.press('ArrowLeft');
  expect((await inscriptionView.boundingBox())?.width).toBe((originalBounds?.width as number) + 1);
  await page.keyboard.press('ArrowRight');
  expect((await inscriptionView.boundingBox())?.width).toBe(originalBounds?.width);
});

test('open search for elements shortcut', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page);
  const palette = page.locator('div.command-palette-suggestions');
  await expect(palette).toBeHidden();
  await editor.focusDiagramAndCheck();
  await page.keyboard.press('Control+KeyF');
  await expect(palette).toBeVisible();
});

test('element navigation mode', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page);
  await editor.startElement.select();
  await page.keyboard.press('N');
  await editor.expectToastToContainText('Navigation On:');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await editor.endElement.expectSelected();
  await page.keyboard.press('Escape');
  await editor.expectToastToContainText('Navigation Off:');
});
