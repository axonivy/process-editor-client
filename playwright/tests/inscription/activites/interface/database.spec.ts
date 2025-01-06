import { test } from '@playwright/test';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { DataCacheTest } from '../../parts/db-cache';
import { DbErrorTest } from '../../parts/db-error';
import { GeneralTest } from '../../parts/name';
import { OutputTest } from '../../parts/output';
import { runTest } from '../../parts/part-tester';
import { QueryAnyTest, QueryDeleteTest, QueryReadTest, QueryUpdateTest, QueryWriteTest } from '../../parts/query';

test.describe('Database', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeEach(async ({ page }) => {
    testee = await createProcess('Database');
    view = await openElementInscription(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Database');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Query Read', async () => {
    await runTest(view, QueryReadTest);
  });

  test('Query Write', async () => {
    await runTest(view, QueryWriteTest);
  });

  test('Query Update', async () => {
    await runTest(view, QueryUpdateTest);
  });

  test('Query Delete', async () => {
    await runTest(view, QueryDeleteTest);
  });

  test('Query Any', async () => {
    await runTest(view, QueryAnyTest);
  });

  test('Cache', async () => {
    await runTest(view, DataCacheTest);
  });

  test('Error', async () => {
    await runTest(view, DbErrorTest);
  });

  test('Output', async () => {
    await runTest(view, OutputTest);
  });
});
