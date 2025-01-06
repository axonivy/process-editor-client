import { test } from '@playwright/test';
import { openMockInscription } from '../../page-objects/inscription/inscription-view';

test.describe('Part states', () => {
  test('different states on different parts', async ({ page }) => {
    const inscriptionView = await openMockInscription(page);
    const casePart = inscriptionView.accordion('Case');
    const dialogPart = inscriptionView.accordion('Dialog');

    await casePart.expectState('configured');
    await dialogPart.expectState('warning');

    await casePart.toggle();
    await casePart.macroInput('Name').clear();
    await casePart.toggle();
    await casePart.expectState('error');
    await dialogPart.expectState('warning');

    await dialogPart.toggle();
    await dialogPart.section('Dialog').open();
    await dialogPart.combobox().choose('AcceptRequest');
    await dialogPart.toggle();
    await casePart.expectState('error');
    await dialogPart.expectState('configured');
  });
});
