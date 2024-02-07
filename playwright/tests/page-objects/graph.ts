import { type Locator, type Page } from '@playwright/test';

export const GRAPH_SELECTOR = '.sprotty-graph:not(.hidden)';

export function graphLocator(page: Page): Locator {
  return page.locator(GRAPH_SELECTOR).first();
}
