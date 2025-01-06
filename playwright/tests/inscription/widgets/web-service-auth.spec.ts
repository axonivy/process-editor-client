import { expect, test } from '@playwright/test';
import { openElementInscription, type Inscription } from '../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../glsp-protocol';
import { createProcess } from '../../glsp-protocol';

test.describe('Web Service Auth Link', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('WebserviceStart', { processKind: 'WEB_SERVICE' });
  });

  test.beforeEach(async ({ page }) => {
    view = await openElementInscription(page, testee.elementId);
  });

  test('jump to process', async () => {
    const wsPart = view.accordion('Web Service');
    await wsPart.toggle();
    await expect(wsPart.currentLocator().getByText('Web service authentication on the')).toBeVisible();
    const link = wsPart.currentLocator().locator('a', { hasText: 'process' });
    await expect(link).toBeVisible();
    await link.click();

    await view.expectHeaderText('Web Service Process', 10000);
  });
});
