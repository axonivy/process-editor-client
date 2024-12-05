import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { DataCacheTest } from '../../parts/db-cache';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';
import { WsErrorTest } from '../../parts/ws-error';
import { WsOutputTest } from '../../parts/ws-output';
import { WsRequestTest } from '../../parts/ws-request';

test.describe('Web Service', () => {
  let view: Inscription;
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
