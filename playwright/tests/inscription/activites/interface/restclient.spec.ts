import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';
import { RestErrorTest } from '../../parts/rest-error';
import { RestOutputTest } from '../../parts/rest-output';
import { RestRequestTest } from '../../parts/rest-request';
import { RestRequestBodyEntityTest, RestRequestBodyFormTest, RestRequestBodyRawTest, RestRequestBodyJaxRsTest } from '../../parts/rest-request-body';

test.describe('Rest Client', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('RestClientCall');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Rest Client');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Request', async () => {
    await runTest(view, RestRequestTest);
  });

  test('RequestBody - Entity', async () => {
    await runTest(view, RestRequestBodyEntityTest);
  });

  test('RequestBody - Form', async () => {
    await runTest(view, RestRequestBodyFormTest);
  });

  test('RequestBody - Raw', async () => {
    await runTest(view, RestRequestBodyRawTest);
  });

  test('RequestBody - JaxRs', async () => {
    await runTest(view, RestRequestBodyJaxRsTest);
  });

  test('Error', async () => {
    await runTest(view, RestErrorTest);
  });

  test('Output', async () => {
    await runTest(view, RestOutputTest);
  });
});
