import { test } from '@playwright/test';
import { openMockInscription } from '../../page-objects/inscription/inscription-view';

test.describe('Mappings', () => {
  test('DialogCall change will update mapping tree', async ({ page }) => {
    const inscriptionView = await openMockInscription(page);
    const callPart = inscriptionView.accordion('Dialog');
    await callPart.open();

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
    const inscriptionView = await openMockInscription(page, { type: 'CallSubStart' });
    const resultPart = inscriptionView.accordion('Result');
    await resultPart.open();

    const mapping = resultPart.section('Mapping');
    await mapping.open();
    const resultTable = mapping.table(['label', 'expression']);
    await resultTable.expectRowCount(1);

    const params = resultPart.section('Result parameters');
    await params.open();
    const paramTable = params.table(['text', 'text', 'text']);
    await paramTable.expectRowCount(0);

    await paramTable.addRow();
    await resultTable.expectRowCount(1);

    await paramTable.row(0).fill(['test', 'String', 'test']);
    await resultTable.expectRowCount(2);

    await paramTable.clear();
    await resultTable.expectRowCount(1);
  });
});
