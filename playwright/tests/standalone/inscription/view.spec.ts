import { test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';
import { Inscription } from '../../page-objects/inscription';

test.describe('inscription view', () => {
  test('elements', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const view = await processEditor.startElement.inscribe();
    await view.expectOpen();
    await view.expectHeader(/Start/);

    await processEditor.endElement.select();
    await view.expectHeader(/End/);

    await processEditor.resetSelection();
    await view.expectClosed();
  });

  test('undo', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.startElement;
    const view = await start.inscribe();
    await changeName(view, 'start', 'hello');

    await processEditor.endElement.select();
    const { section, input } = await changeName(view, '', 'world');

    await section.undo();
    await input.expectValue('');

    await start.select();
    await view.openSection('General');
    await section.undo();
    await input.expectValue('start');
  });

  test('ivyscript lsp', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const view = await processEditor.startElement.inscribe();
    await view.openSection('Start');
    await view.monaco().expectContentAssist('ivy');
  });

  test('process', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const view = await processEditor.toggleInscription();
    await view.expectOpen();
    await view.expectHeader(/Business Process/);

    await processEditor.toggleInscription();
    await view.expectClosed();
  });
});

async function changeName(view: Inscription, oldValue: string, value: string) {
  const section = await view.openSection('General');
  const input = view.input('Display name');
  await input.expectValue(oldValue);
  await input.fill(value);
  return { section, input };
}
