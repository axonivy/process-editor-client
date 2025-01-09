import { expect, test } from '@playwright/test';
import { InscriptionView } from '../../page-objects/inscription/inscription-view';

test.describe('Reset part', () => {
  test('reset button', async ({ page }) => {
    const inscriptionView = await InscriptionView.mock(page);
    const part = inscriptionView.accordion('General');
    await part.open();

    const resetBtn = part.reset();
    await expect(resetBtn).not.toBeVisible();
    const name = part.textArea({ label: 'Display name' });
    await name.fill('bla');
    await expect(resetBtn).toBeVisible();

    await resetBtn.click();
    await name.expectValue('test name');
  });
});
