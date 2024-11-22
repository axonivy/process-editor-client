import { test } from '@playwright/test';
import { InscriptionView } from '../../page-objects/inscription/InscriptionView';

test.describe('Readonly', () => {
  test('edit mode', async ({ page }) => {
    const inscriptionView = await InscriptionView.mock(page);
    const name = inscriptionView.accordion('General');
    await name.toggle();
    await name.textArea({ label: 'Display name' }).expectEnabled();
  });

  test('readonly mode', async ({ page }) => {
    const inscriptionView = await InscriptionView.mock(page, { readonly: true });
    const name = inscriptionView.accordion('General');
    await name.toggle();
    await name.textArea({ label: 'Display name' }).expectDisabled();
  });
});
