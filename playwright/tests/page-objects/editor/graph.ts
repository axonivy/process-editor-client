import { type Locator, type Page } from '@playwright/test';

export const GRAPH_SELECTOR = '.sprotty-graph:not(.hidden)';

export function graphLocator(page: Page): Locator {
  return page.locator(GRAPH_SELECTOR).first();
}

export const DIAGRAM_SELECTOR = '[data-svg-metadata-type="graph"]';

export function diagramLocator(page: Page): Locator {
  return page.locator(DIAGRAM_SELECTOR).first();
}
