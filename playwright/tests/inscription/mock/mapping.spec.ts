import { test } from '@playwright/test';
import { InscriptionView } from '../../page-objects/inscription/InscriptionView';

test.describe('Mappings', () => {
  test('DialogCall change will update mapping tree', async ({ page }) => {
    const inscriptionView = await InscriptionView.mock(page);
    const callPart = inscriptionView.accordion('Dialog');
    await callPart.toggle();

    const dialogSection = callPart.section('Dialog');
    await dialogSection.open();
    const dialogCombo = dialogSection.combobox();
    await dialogCombo.choose('AcceptRequest');
    const callTable = callPart.table(['text', 'label', 'expression']);
    await callTable.expectRowCount(11);

    await dialogCombo.choose('test1');
    await callTable.expectRowCount(3);
  });

  test('SubStart result param change will update mapping tree', async ({ page }) => {
    const inscriptionView = await InscriptionView.mock(page, { type: 'CallSubStart' });
    const resultPart = inscriptionView.accordion('Result');
    await resultPart.toggle();

    await resultPart.section('Mapping').open();
    const resultTable = resultPart.table(['text', 'label', 'expression']);
    await resultTable.expectRowCount(1);

    const params = resultPart.section('Result parameters');
    await params.toggle();
    const paramTable = params.table(['text', 'label', 'expression']);
    await paramTable.expectRowCount(0);

    await paramTable.addRow();
    await params.toggle();
    await resultTable.expectRowCount(2);

    await params.toggle();
    await paramTable.clear();
    await resultTable.expectRowCount(1);
  });
});
