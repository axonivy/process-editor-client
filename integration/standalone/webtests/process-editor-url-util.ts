import { expect, Page } from '@playwright/test';
import { v4 as uuid } from 'uuid';
import { startSelector } from './diagram-util';

function serverUrl(): string {
  const server = process.env.BASE_URL ?? 'localhost:8081';
  return server.replace(/^https?:\/\//, '');
}

export async function gotoRandomTestProcessUrl(page: Page, urlQueryParam = ''): Promise<void> {
  await page.goto(randomTestProcessUrl() + urlQueryParam);
  const start = page.locator(startSelector);
  // wait for start element, give a reload if was not visible the first time
  await start.waitFor({ state: 'visible', timeout: 10000 });
  if (!(await start.isVisible())) {
    await page.reload();
    await expect(start).toBeVisible();
  }
  page.addStyleTag({ content: '.palette-body {transition: none !important;}' });
}

function randomTestProcessUrl(): string {
  return processEditorUrl('glsp-test-project', `/processes/test/${uuid()}.p.json`);
}

export function processEditorUrl(pmv: string, file: string): string {
  const app = process.env.TEST_APP ?? 'designer';
  return `?server=${serverUrl()}&app=${app}&pmv=${pmv}&file=${file}`;
}
