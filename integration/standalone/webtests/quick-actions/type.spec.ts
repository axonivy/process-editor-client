import { test, expect, Locator, Page } from '@playwright/test';
import { embeddedSelector, endSelector, multiSelect, startSelector } from '../diagram-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { clickQuickActionEndsWith, clickQuickActionStartsWith } from './quick-actions-util';

test.describe('quick actions - change BPMN type', () => {
  const PALETTE_BODY = '.activity-type-menu';

  test.beforeEach(async ({ page, browserName }) => {
    await gotoRandomTestProcessUrl(page);
    const paletteBody = page.locator(PALETTE_BODY);
    await expect(paletteBody).toBeHidden();

    const start = page.locator(startSelector);
    const end = page.locator(endSelector);
    await wrapToEmbedded([start, end], page, browserName);
  });

  test('switch type', async ({ page, browserName }) => {
    const types = page.locator(PALETTE_BODY + ' .menu-item');
    const userIcon = page.locator('.sprotty-graph .userBpmnElement .si-user-element');
    const embedded = page.locator(embeddedSelector);
    const user = page.locator('.sprotty-graph .userBpmnElement');

    await expect(embedded).toBeVisible();
    await expect(user).toBeHidden();
    await expect(userIcon).toBeHidden();

    await openTypePalette(page);
    await types.locator('text=User').click();
    await expect(userIcon).toBeVisible();
    await expect(user).toBeVisible();
    await expect(embedded).toBeHidden();

    await openTypePalette(page, false);
    await types.locator('text=Sub').click();
    await expect(embedded).toBeVisible();
    await expect(user).toBeHidden();
    await expect(userIcon).toBeHidden();
  });

  async function wrapToEmbedded(elements: Locator[], page: Page, browserName: string): Promise<void> {
    await multiSelect(page, elements, browserName);
    await clickQuickActionStartsWith(page, 'Wrap');
  }

  async function openTypePalette(page: Page, select = true): Promise<Locator> {
    const paletteBody = page.locator(PALETTE_BODY);
    if (select) {
      await page.locator(embeddedSelector).click();
    }
    await clickQuickActionEndsWith(page, 'Type');
    await expect(paletteBody).toBeVisible();
    return paletteBody;
  }
});
