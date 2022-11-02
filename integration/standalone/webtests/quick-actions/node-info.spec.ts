import { expect, Locator, Page, test } from '@playwright/test';
import { processEditorUrl } from '../process-editor-url-util';
import { clickQuickActionStartsWith } from './quick-actions-util';

test.describe('quick actions - info', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(processEditorUrl('glsp-test-project', '/processes/info.p.json'));
  });

  test('additional info', async ({ page }) => {
    await openInfoMenu(page, page.locator('#sprotty_1842D6FBB6A107AB-f0'));
    await assertTitle(page, 'start.ivp');
    await assertAdditionalInfo(page, 'Request Role', 'Employee');
    await assertAdditionalInfo(page, 'Task Responsible', 'Teamleader');
  });

  test('code info', async ({ page }) => {
    await openInfoMenu(page, page.locator('#sprotty_1842D6FBB6A107AB-f31'));
    await assertAdditionalCodeInfo(page, 'variable.source());\n...');
  });

  test('description', async ({ page }) => {
    await openInfoMenu(page, page.locator('#sprotty_1842D6FBB6A107AB-f3'));
    const description = page.locator('.simple-menu-text', { hasText: 'title' });
    await expect(description.locator('h1')).toHaveText('title');
    await expect(description.locator('p')).toHaveText('blablabla');
  });

  test('edge - condition', async ({ page }) => {
    await openInfoMenu(page, page.locator('#sprotty_1842D6FBB6A107AB-f7'));
    await assertTitle(page, 'false');
    await assertAdditionalInfo(page, 'Condition', 'false');
  });

  test('edge - in/out', async ({ page }) => {
    await openInfoMenu(page, page.locator('#sprotty_1842D6FBB6A107AB-f30'));
    await assertTitle(page, 'blu [in2]');
  });

  test('embedded proc - outerElement', async ({ page }) => {
    const embeddedProcessElement = page.locator('#sprotty_1842D6FBB6A107AB-S10');
    const embeddedStart = page.locator('#sprotty_1842D6FBB6A107AB-S10-g0');
    await expect(embeddedProcessElement).toBeVisible();
    await embeddedProcessElement.click();
    await clickQuickActionStartsWith(page, 'Jump');
    await expect(embeddedStart).toBeVisible();
    await openInfoMenu(page, embeddedStart);
    await assertTitle(page, 'in 1 [start4.ivp]');
  });

  async function assertTitle(page: Page, expectedTitle?: string): Promise<void> {
    const title = page.locator('.simple-menu-header');
    if (expectedTitle) {
      await expect(title).toHaveText(expectedTitle);
    } else {
      await expect(title).toBeHidden();
    }
  }

  async function assertAdditionalInfo(page: Page, infoLabel: string, infoValue: string): Promise<void> {
    const text = page.locator('.simple-menu-text', { hasText: infoLabel });
    await expect(text).toContainText(infoValue);
  }

  async function assertAdditionalCodeInfo(page: Page, code: string): Promise<void> {
    const text = page.locator('.simple-menu-text', { hasText: 'Code' });
    await expect(text.locator('pre')).toContainText(code);
  }

  async function openInfoMenu(page: Page, locator: Locator): Promise<void> {
    await locator.click();
    await clickQuickActionStartsWith(page, 'Information');
    await expect(page.locator('.simple-menu-text.simple-menu-small', { hasText: 'PID' })).toBeVisible();
  }
});
