import { resolve } from 'path';
import { v4 as uuid } from 'uuid';

export function baseUrl(): string {
  return resolve('app', 'diagram.html');
}

export function serverUrl(): string {
  const app = process.env.TEST_APP ?? '';
  const server = process.env.BASE_URL + app;
  return server.replace(/^https?:\/\//, '');
}

export function randomTestProcessUrl(): string {
  return processEditorUrl('workflow-demos', `/processes/test/${uuid()}.mod`);
}

export function procurementRequestParallelUrl(): string {
  return workflowDemosUrl('/processes/Humantask/ProcurementRequestParallel.mod');
}

export function workflowDemosUrl(file: string): string {
  return processEditorUrl('workflow-demos', file);
}

export function processEditorUrl(pmv: string, file: string): string {
  return `file://${baseUrl()}?server=${serverUrl()}&pmv=${pmv}&file=${file}`;
}
