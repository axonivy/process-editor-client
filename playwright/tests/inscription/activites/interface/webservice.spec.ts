import { test } from '@playwright/test';
import { InscriptionView } from '../../../page-objects/inscription/InscriptionView';
import { GeneralTest, WsRequestTest, WsErrorTest, WsOutputTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { DataCacheTest } from '../../parts/db-cache';

test.describe('Web Service', () => {
  let view: InscriptionView;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('WebServiceCall');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Web Service');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Request', async () => {
    await runTest(view, WsRequestTest);
  });

  test('Cache', async () => {
    await runTest(view, DataCacheTest);
  });

  test('Error', async () => {
    await runTest(view, WsErrorTest);
  });

  test('Output', async () => {
    await runTest(view, WsOutputTest);
  });
});
