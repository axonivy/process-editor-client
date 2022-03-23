import { expect, Locator, Page } from '@playwright/test';

export async function editLabel(page: Page, element: Locator, text = 'test label'): Promise<void> {
  const label = page.locator('#sprotty_editLabelUi textarea');
  await element.click();
  await clickQuickActionEndsWith(page, 'Label (L)');
  await expect(label).toBeVisible();
  await label.fill(text);
  await page.keyboard.press('Enter');
}

export async function assertQuickActionsCount(page: Page, count: number): Promise<void> {
  await expect(page.locator('#sprotty_quickActionsUi i')).toHaveCount(count);
}

export async function clickQuickAction(page: Page, title: string): Promise<void> {
  await page.locator(`#sprotty_quickActionsUi i[title="${title}"]`).click();
}

export async function clickQuickActionStartsWith(page: Page, startsWithTitle: string): Promise<void> {
  await page.locator(`#sprotty_quickActionsUi i[title^="${startsWithTitle}"]`).click();
}

export async function clickQuickActionEndsWith(page: Page, endsWithTitle: string): Promise<void> {
  await page.locator(`#sprotty_quickActionsUi i[title$="${endsWithTitle}"]`).click();
}
