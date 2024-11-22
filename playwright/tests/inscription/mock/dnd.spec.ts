import { expect, test } from '@playwright/test';
import { InscriptionView } from '../../page-objects/inscription/InscriptionView';

test.describe('Drag and drop features', () => {
  test('Alternative condition reorder', async ({ page }) => {
    const inscriptionView = await InscriptionView.mock(page, { type: 'Alternative' });
    const conditions = inscriptionView.accordion('Condition');
    await conditions.toggle();

    const rows = page.locator('.ui-dnd-row');
    await expect(rows).toHaveCount(2);
    await expect(rows.first()).toHaveText(/Mock Element/);
    await expect(rows.last()).toHaveText(/f6/);

    await rows.first().locator('.ui-dnd-row-handleicon').dragTo(rows.last().locator('.ui-dnd-row-handleicon'));
    await expect(rows.first()).toHaveText(/f6/);
    await expect(rows.last()).toHaveText(/Mock Element/);
  });
});
