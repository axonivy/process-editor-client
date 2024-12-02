import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/InscriptionView';
import { browserBtn } from './browser-mock-utils';

test('Add Condition', async ({ page }) => {
  const inscriptionView = await InscriptionView.mock(page, { type: 'Alternative' });
  const condition = inscriptionView.accordion('Condition');
  await condition.toggle();
  const conditionSection = condition.section('Condition');
  await conditionSection.expectIsOpen();
  const conditionTable = condition.table(['label', 'expression']);
  const conditionCell = conditionTable.row(1).column(1);
  await conditionCell.focusScriptCell();
  await browserBtn(page).nth(0).click();
  await applyConditionBuilder(page);
  await conditionCell.expectValue('(data.value1 == 10 && data.value2 > 5) || (data.value3 < 6)');
});

export async function applyConditionBuilder(page: Page) {
  const browserDialog = page.getByRole('dialog');
  await expect(browserDialog).toBeVisible();
  await browserDialog.getByText('Condition').first().click();
  const condition = browserDialog.locator('.ui-condition-builder-condition');
  const group = browserDialog.locator('.ui-condition-builder-group');

  expect(browserDialog.getByRole('combobox').nth(0)).toHaveText('Basic Condition');
  expect(await condition.count()).toBe(1);
  expect(await condition.getByRole('textbox').count()).toBe(2);

  await condition.getByRole('textbox').nth(0).fill('data.value1');
  await condition.getByRole('combobox').click();
  await page.getByRole('option', { name: 'equal to', exact: true }).first().click();
  await condition.getByRole('textbox').nth(1).fill('10');

  await page.getByLabel('Add Condition').click();
  const newConditions = await condition.count();
  expect(newConditions).toBe(2);
  await condition.nth(1).getByRole('textbox').nth(0).fill('data.value2');
  await condition.nth(1).getByRole('combobox').click();
  await page.getByRole('option', { name: 'greater than', exact: true }).first().click();
  await condition.nth(1).getByRole('textbox').nth(1).fill('5');

  await page.getByRole('dialog').getByRole('combobox').nth(0).click();
  await page.getByRole('option', { name: 'Nested Condition', exact: true }).first().click();

  expect(await group.count()).toBe(1);
  await page.getByLabel('Add Condition Group').click();
  expect(await group.count()).toBe(2);
  await group.nth(0).getByRole('combobox').nth(3).click();
  await page.getByRole('option', { name: 'or', exact: true }).first().click();

  await condition.nth(2).getByRole('textbox').nth(0).fill('data.value3');
  await page.locator('.ui-condition-builder-condition').nth(2).getByRole('combobox').click();
  await page.getByRole('option', { name: 'less than', exact: true }).first().click();
  await condition.nth(2).getByRole('textbox').nth(1).fill('6');

  await page.getByRole('button', { name: 'Apply' }).click();
}
