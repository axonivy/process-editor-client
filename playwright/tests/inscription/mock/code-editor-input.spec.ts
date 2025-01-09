import type { Page } from '@playwright/test';
import { test } from '@playwright/test';
import type { MacroEditor, ScriptInput } from '../../page-objects/inscription/code-editor';
import { openMockInscription } from '../../page-objects/inscription/inscription-view';

test.describe('Code Editor Input', () => {
  test('MacroInput - no new line', async ({ page }) => {
    const inscriptionView = await openMockInscription(page);
    const taskPart = inscriptionView.accordion('Case');
    await taskPart.toggle();
    await assertNoNewLine(page, taskPart.macroInput('Name'));
  });

  test('ScriptInput - no new line', async ({ page }) => {
    const inscriptionView = await openMockInscription(page);
    const taskPart = inscriptionView.accordion('Task');
    await taskPart.toggle();
    const expirySection = taskPart.section('Expiry');
    await expirySection.toggle();
    await assertNoNewLine(page, expirySection.scriptInput('Timeout'));
  });

  test('ScriptCell - enter accepts value', async ({ page }) => {
    await assertAcceptScriptCellValue(page, 'Enter');
  });

  test('ScriptCell - tab accepts value', async ({ page }) => {
    await assertAcceptScriptCellValue(page, 'Tab');
  });

  test('ScriptCell - escape accepts value', async ({ page }) => {
    await assertAcceptScriptCellValue(page, 'Escape');
  });

  test('ScriptCell - update on input', async ({ page }) => {
    await assertAcceptScriptCellValue(page);
  });

  async function assertNoNewLine(page: Page, name: ScriptInput | MacroEditor) {
    await name.fill('test \nnewline');
    await name.expectValue('test newline');
  }

  async function assertAcceptScriptCellValue(page: Page, key?: string) {
    const inscriptionView = await openMockInscription(page);
    const taskPart = inscriptionView.accordion('Output');
    await taskPart.toggle();
    await taskPart.table(['label', 'expression']).row(1).column(1).fill('test');
    if (key) {
      await page.keyboard.press(key);
    }

    await taskPart.toggle();
    await taskPart.toggle();
    await taskPart.table(['label', 'expression']).row(1).column(1).expectValue('test');
  }
});
