import { test } from '@playwright/test';
import { InscriptionView, type Inscription } from '../../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { MailAttachmentTest } from '../../parts/mail-attachments';
import { MailContentTest } from '../../parts/mail-content';
import { MailErrorTest } from '../../parts/mail-error';
import { MailHeaderTest } from '../../parts/mail-header';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';

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
