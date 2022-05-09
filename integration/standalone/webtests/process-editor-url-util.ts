import { expect, Page } from '@playwright/test';
import { resolve } from 'path';
import { v4 as uuid } from 'uuid';
import { startSelector } from './diagram-util';

export function baseUrl(): string {
  return resolve('app', 'diagram.html');
}

export function serverUrl(): string {
  const app = process.env.TEST_APP ?? '';
  const server = process.env.BASE_URL + app;
  return server.replace(/^https?:\/\//, '');
}

export async function gotoRandomTestProcessUrl(page: Page): Promise<void> {
  await page.goto(randomTestProcessUrl());
  const start = page.locator(startSelector);
  // wait for start element, give a reload if was not visible the first time
  await start.waitFor({ state: 'visible', timeout: 10000 });
  if (!start.isVisible()) {
    await page.reload();
    await expect(start).toBeVisible();
  }
}

export function randomTestProcessUrl(): string {
  return processEditorUrl('workflow-demos', `/processes/test/${uuid()}.p.json`);
}

export function procurementRequestParallelUrl(): string {
  return workflowDemosUrl('/processes/Humantask/ProcurementRequestParallel.p.json');
}

export function triggerNewEmployeeUrl(): string {
  return workflowDemosUrl('/processes/Trigger/NewEmployee.p.json');
}

export function workflowDemosUrl(file: string): string {
  return processEditorUrl('workflow-demos', file);
}

export function processEditorUrl(pmv: string, file: string): string {
  return `file://${baseUrl()}?server=${serverUrl()}&pmv=${pmv}&file=${file}`;
}
