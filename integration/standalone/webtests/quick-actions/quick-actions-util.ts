import { expect, Locator, Page } from '@playwright/test';

export const QUICK_ACTION_BTN = '#sprotty_quickActionsUi span';

export async function editLabel(page: Page, element: Locator, text = 'test label'): Promise<void> {
  const label = page.locator('#sprotty_ivyEditLabelUi textarea');
  await element.click();
  await clickQuickActionEndsWith(page, 'Label (L)');
  await expect(label).toBeVisible();
  await label.fill(text);
  await page.keyboard.press('Enter');
}

export async function assertQuickActionsCount(page: Page, count: number): Promise<void> {
  await expect(page.locator(QUICK_ACTION_BTN)).toHaveCount(count);
}

export async function clickQuickAction(page: Page, title: string): Promise<void> {
  await page.locator(`${QUICK_ACTION_BTN}[title="${title}"]`).click();
}

export async function clickQuickActionStartsWith(page: Page, startsWithTitle: string): Promise<void> {
  await page.locator(`${QUICK_ACTION_BTN}[title^="${startsWithTitle}"]`).click();
}

export async function clickQuickActionEndsWith(page: Page, endsWithTitle: string): Promise<void> {
  await page.locator(`${QUICK_ACTION_BTN}[title$="${endsWithTitle}"]`).click();
}
