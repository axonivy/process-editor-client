import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { MailAttachmentTest, MailContentTest, MailHeaderTest, MailErrorTest, GeneralTest, runTest } from '../../parts';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';

test.describe('EMail', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('EMail');
  });

  test.beforeEach(async ({ page }) => {
    view = await InscriptionView.selectElement(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('E-Mail');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('MailHeader', async () => {
    await runTest(view, MailHeaderTest);
  });

  test('MailError', async () => {
    await runTest(view, MailErrorTest);
  });

  test('MailContent', async () => {
    await runTest(view, MailContentTest);
  });

  test('MailAttachments', async () => {
    await runTest(view, MailAttachmentTest);
  });
});
