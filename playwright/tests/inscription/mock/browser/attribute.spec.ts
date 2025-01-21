import { expect, test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/inscription-view';
import { applyBrowser, assertCodeHidden, assertCodeVisible, code } from './browser-mock-utils';

test('browser add to input', async ({ page }) => {
  const inscriptionView = await InscriptionView.mock(page);
  const task = inscriptionView.accordion('Task');
  await task.open();

  const description = task.macroArea('Description');
  await assertCodeHidden(page);
  await description.focus();
  await assertCodeVisible(page);

  await applyBrowser(page, 'Attribute', 'in.bla', 2);
  await expect(code(page).getByRole('textbox')).toHaveValue('<%=in.bla%>');
});

test('browser replace selection', async ({ page }) => {
  const inscriptionView = await InscriptionView.mock(page);
  const task = inscriptionView.accordion('Task');
  await task.open();

  const category = task.macroInput('Category');
  await assertCodeHidden(page);
  await category.focus();
  await assertCodeVisible(page);

  await page.keyboard.type('test 123 zag');
  await code(page).dblclick();

  await applyBrowser(page, 'Attribute', 'in.bla', 2);
  await expect(code(page).getByRole('textbox')).toHaveValue('test 123 <%=in.bla%>');
});

test('browser add attribute doubleclick', async ({ page }) => {
  const inscriptionView = await InscriptionView.mock(page);
  const task = inscriptionView.accordion('Task');
  await task.open();

  const description = task.macroArea('Description');
  await assertCodeHidden(page);
  await description.focus();
  await assertCodeVisible(page);

  await applyBrowser(page, 'Attribute', undefined, 2, true);
  await expect(code(page).getByRole('textbox')).toHaveValue('<%=in.bla%>');
});
