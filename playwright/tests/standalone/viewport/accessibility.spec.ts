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
  const inscriptionWidth = async () => (await inscriptionView.boundingBox())?.width;
  const originalWidth = (await inscriptionWidth()) as number;
  await page.keyboard.press('F3');
  expect(await inscriptionWidth()).toBe(originalWidth + 20);
  await page.keyboard.press('F4');
  expect(await inscriptionWidth()).toBe(originalWidth);
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
