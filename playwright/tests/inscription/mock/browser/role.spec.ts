import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { openMockInscription } from '../../../page-objects/inscription/inscription-view';
import { assertCodeHidden, browserBtn } from './browser-mock-utils';

test('browser add role', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.accordion('Task');
  await task.open();
  await assertCodeHidden(page);
  await task.section('Responsible').open();
  await applyRoleBrowser(page, 'Employee', 1);
  await expect(page.getByRole('combobox').nth(1)).toHaveText('Employee');
});

test('browser role open add role popover', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.accordion('Task');
  await task.open();
  await assertCodeHidden(page);
  await task.section('Responsible').open();
  await applyRoleBrowser(page, 'Employee', 1, undefined, true);
  await expect(page.getByRole('combobox').nth(1)).toHaveText('Employee');
});

test('browser add role doubleclick', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.accordion('Task');
  await task.open();
  await assertCodeHidden(page);
  await task.section('Responsible').open();
  await applyRoleBrowser(page, undefined, 1, true);
  await expect(page.getByRole('combobox').nth(1)).toHaveText('Employee');
});

async function applyRoleBrowser(page: Page, expectedSelection: string = '', rowToCheck: number, dblClick?: boolean, openPopover?: boolean) {
  await browserBtn(page).nth(0).click();
  const browserDialog = page.getByRole('dialog');
  await expect(browserDialog).toBeVisible();
  await browserDialog.getByText('Role').nth(1).click();
  await browserDialog.getByRole('row').nth(rowToCheck).click();
  if (openPopover) {
    await browserDialog.getByRole('button', { name: 'Add Role to Employee' }).click();
    const popover = page.getByRole('dialog').nth(1);
    await expect(popover).toBeVisible();
    const addRoleInput = popover.getByLabel('New role name');
    const addRoleButton = popover.getByRole('button', { name: 'Add new Role' });
    await addRoleInput.fill('test');
    await addRoleButton.click();

    await expect(popover).toBeHidden();
  }

  if (dblClick) {
    await browserDialog.getByRole('row').nth(rowToCheck).dblclick();
  } else {
    await expect(browserDialog.locator('.browser-helptext')).toHaveText(expectedSelection);
    await browserDialog.getByRole('button', { name: 'Apply' }).click();
  }

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(browserBtn(page).nth(0)).toBeVisible();
}
