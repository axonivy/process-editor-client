import { expect, test } from '@playwright/test';
import { InscriptionView } from '../../page-objects/inscription/inscription-view';

test.describe('Validations', () => {
  const normalColor = 'rgb(231, 231, 231)';
  const errorColor = 'rgb(229, 21, 28)';
  const warningColor = 'rgb(255, 115, 0)';

  test('case', async ({ page }) => {
    const inscriptionView = await InscriptionView.mock(page);
    const part = inscriptionView.accordion('Case');
    const section = part.section('Details');
    const name = section.macroInput('Name');
    const desc = section.macroArea('Description');

    await part.toggle();
    await section.open();
    await expect(name.locator).toHaveCSS('border-color', normalColor);
    await expect(desc.locator).toHaveCSS('border-color', normalColor);

    await name.clear();
    await desc.clear();
    await expect(name.locator).toHaveCSS('border-color', errorColor);
    await expect(desc.locator).toHaveCSS('border-color', warningColor);
  });

  test('dialog', async ({ page }) => {
    const inscriptionView = await InscriptionView.mock(page);
    const part = inscriptionView.accordion('Dialog');
    const dialogSection = part.section('Dialog');
    const mappingSection = part.section('Mapping');
    const dialog = dialogSection.combobox();
    const mapping = mappingSection.table(['text', 'expression']);

    await part.toggle();
    await dialogSection.open();
    await mappingSection.open();
    await expect(dialog.locator).toHaveCSS('border-color', warningColor);
    await expect(mapping.row(1).locator).toHaveCSS('border-color', warningColor);

    await dialog.fill('bla');
    await expect(dialog.locator).toHaveCSS('border-color', normalColor);
  });
});
