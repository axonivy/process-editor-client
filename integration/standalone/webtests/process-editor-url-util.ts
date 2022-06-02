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
  // Log websocket communications:
  if (process.env.CI) {
    page.on('websocket', ws => {
      console.log(`WebSocket opened: ${ws.url()}>`);
      ws.on('framesent', event => console.log('>> sent: ' + event.payload));
      ws.on('framereceived', event => console.log('<< recv: ' + event.payload));
      ws.on('close', () => console.log('WebSocket closed'));
    });
  }
  await page.goto(randomTestProcessUrl() + urlQueryParam);
  const start = page.locator(startSelector);
  // wait for start element, give a reload if was not visible the first time
  await start.waitFor({ state: 'visible', timeout: 10000 });
  if (!start.isVisible()) {
    await page.reload();
    await expect(start).toBeVisible();
  }
}

function randomTestProcessUrl(): string {
  return processEditorUrl('workflow-demos', `/processes/test/${uuid()}.p.json`);
}

export function processEditorUrl(pmv: string, file: string): string {
  return `file://${baseUrl()}?server=${serverUrl()}&pmv=${pmv}&file=${file}`;
}
