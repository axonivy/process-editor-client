import { expect, Page } from '@playwright/test';
import { resolve } from 'path';
import { v4 as uuid } from 'uuid';
import { startSelector } from './diagram-util';

function baseUrl(): string {
  return resolve('app', 'index.html');
}

function serverUrl(): string {
  const app = process.env.TEST_APP ?? '';
  const server = process.env.BASE_URL ? process.env.BASE_URL + app : 'localhost:8081/designer';
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
  return `file://${baseUrl()}?server=${serverUrl()}&pmv=${pmv}&file=${file}`;
}
