import { test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';
import type { Inscription } from '../../page-objects/inscription/inscription-view';

test('elements', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const view = await processEditor.startElement.inscribe();
  await view.expectOpen();
  await view.expectHeaderText(/Start/);

  await processEditor.endElement.select();
  await view.expectHeaderText(/End/);

  await processEditor.resetSelection();
  await view.expectClosed();
});

test('undo', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  const view = await start.inscribe();
  await changeName(view, 'start', 'hello');

  await processEditor.endElement.select();
  const { part, input } = await changeName(view, '', 'world');

  await part.reset().click();
  await input.expectValue('');

  await start.select();
  await part.toggle();
  await part.reset().click();
  await input.expectValue('start');
});

test('ivyscript lsp', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const view = await processEditor.startElement.inscribe();
  const part = view.accordion('Start');
  await part.toggle();
  const section = part.section('Code');
  await section.open();
  const code = section.scriptArea();
  await code.triggerContentAssist();
  await code.expectContentAssistContains('ivy');
});

test('process', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const view = await processEditor.toggleInscription();
  await view.expectOpen();
  await view.expectHeaderText(/Business Process/);

  await processEditor.toggleInscription();
  await view.expectClosed();
});

async function changeName(view: Inscription, oldValue: string, value: string) {
  const part = view.accordion('General');
  await part.toggle();
  const section = part.section('Name / Description');
  await section.open();
  const input = section.textArea({ label: 'Display name' });
  await input.expectValue(oldValue);
  await input.fill(value);
  return { part, input };
}
