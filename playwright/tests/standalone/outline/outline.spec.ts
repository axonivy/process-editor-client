import { expect, Page, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';

test('outline', async ({ page }) => {
  const { outline } = await openOutline(page, '/processes/quickstart.p.json');
  await outline.view.getByRole('row').all();
  const rows = await outline.view.getByRole('row').all();
  await expect(rows[0]).toHaveText('148655DDB7BB6588Process');
  await expect(rows[1]).toHaveText('start.ivpRequestStart');
  await expect(rows[2]).toHaveText('148655DDB7BB6588-f1TaskEnd');
  await expect(rows[3]).toHaveText('Enter ProductDialogCall');
  await expect(rows[4]).toHaveText('Price higher than 100?Alternative');
  await expect(rows[5]).toHaveText('148655DDB7BB6588-f7TaskEnd');
});

test('select element', async ({ page }) => {
  const { processEditor, outline } = await openOutline(page);
  await processEditor.endElement.select();
  await outline.expectSelected('End');

  await processEditor.startElement.select();
  await outline.expectSelected('Start');
});

test('select node', async ({ page }) => {
  const { processEditor, outline } = await openOutline(page);
  await outline.select('End');
  await processEditor.endElement.expectSelected();

  await outline.select('Start');
  await processEditor.startElement.expectSelected();

  await outline.select('End');
  await outline.doubleClick('End');
  await processEditor.endElement.expectSelected();
  await outline.expectClosed();
});

const openOutline = async (page: Page, file?: string) => {
  const processEditor = await ProcessEditor.openProcess(page, { file });
  const inscription = await processEditor.startElement.inscribe();
  const outline = await inscription.toggleOutline();
  await outline.expectSelected('Start');
  return { processEditor, inscription, outline };
};
