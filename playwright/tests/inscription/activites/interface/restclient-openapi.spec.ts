import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { RestRequestBodyOpenApiTest, RestRequestOpenApiTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('Rest Client - OpenApi', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('RestClientCall');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Request - OpenApi', async () => {
    await runTest(view, RestRequestOpenApiTest);
  });

  test('RequestBody - OpenApi', async () => {
    await runTest(view, RestRequestBodyOpenApiTest);
  });
});
