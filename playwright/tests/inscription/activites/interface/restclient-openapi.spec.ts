import { test } from '@playwright/test';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { runTest } from '../../parts/part-tester';
import { RestRequestOpenApiTest } from '../../parts/rest-request';
import { RestRequestBodyOpenApiTest } from '../../parts/rest-request-body';

test.describe('Rest Client - OpenApi', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('RestClientCall');
  });

  test.beforeEach(async ({ page }) => {
    view = await openElementInscription(page, testee.elementId);
  });

  test('Request - OpenApi', async () => {
    await runTest(view, RestRequestOpenApiTest);
  });

  test('RequestBody - OpenApi', async () => {
    await runTest(view, RestRequestBodyOpenApiTest);
  });
});
