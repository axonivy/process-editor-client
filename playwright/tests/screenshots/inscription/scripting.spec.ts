import { test, type Page } from '@playwright/test';
import { screenshot } from './screenshot-util';
import type { Accordion } from '../../page-objects/inscription/accordion';
import { InscriptionView } from '../../page-objects/inscription/inscription-view';

const GENERIC_PID = {
  SCRIPT: '168F0C6DF682858E-f3',
  USER_TASK: '168F0C6DF682858E-f5'
} as const;

test.describe('Scripting', () => {
  test('Completion', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    const accordion = await openAccordion(page, GENERIC_PID.SCRIPT, 'Output');
    const section = await codeOnly(accordion);
    const script = section.scriptArea();

    await script.fill('ivy.');
    await script.triggerContentAssist();
    await screenshot(section.currentLocator(), 'code-completor.png');
  });

  test('Hopping', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    const accordion = await openAccordion(page, GENERIC_PID.SCRIPT, 'Output');
    const section = await codeOnly(accordion);
    const script = section.scriptArea();

    await script.fill('in.set');
    await script.triggerContentAssist();
    await page.keyboard.press('Enter');

    await screenshot(section.currentLocator(), 'code-param-hopping.png');
  });

  test('Macro', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    const accordion = await openAccordion(page, GENERIC_PID.USER_TASK, 'Task');
    const section = accordion.section('Details');
    await section.open();
    const script = section.macroArea('Name');

    await script.fill('Verify User <%= ');
    await script.focus();
    await page.keyboard.press('ArrowLeft+ArrowLeft+ArrowLeft');
    await page.keyboard.type('in.');

    await screenshot(section.currentLocator(), 'code-macro.png');
  });
});

async function openAccordion(page: Page, pid: string, accordionName): Promise<Accordion> {
  const view = await InscriptionView.selectElement(page, pid, 'inscription-test-project');
  await page.addStyleTag({ content: 'body { overflow: hidden; }' });
  const accordion = view.accordion(accordionName);
  await accordion.toggle();
  return accordion;
}

async function codeOnly(accordion: Accordion) {
  await accordion.section('Mapping').close();
  const section = accordion.section('Code');
  await section.open();
  return section;
}
