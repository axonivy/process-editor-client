import { test } from '@playwright/test';
import { openMockInscription } from '../../page-objects/inscription/inscription-view';

test.describe('Readonly', () => {
  test('edit mode', async ({ page }) => {
    const inscriptionView = await openMockInscription(page);
    const name = inscriptionView.accordion('General');
    await name.toggle();
    await name.textArea({ label: 'Display name' }).expectEnabled();
  });

  test('readonly mode', async ({ page }) => {
    const inscriptionView = await openMockInscription(page, { readonly: true });
    const name = inscriptionView.accordion('General');
    await name.toggle();
    await name.textArea({ label: 'Display name' }).expectDisabled();
  });
});
