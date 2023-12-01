import { test, expect } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';

test.describe('url parameters', () => {
  test('viewer mode', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page, { urlQueryParam: '&mode=viewer' });
    await expect(processEditor.toolbar().locator()).toBeHidden();
    await expect(processEditor.viewport().locator()).toBeVisible();
  });

  test('preview mode', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page, { urlQueryParam: '&mode=preview' });
    await expect(processEditor.toolbar().locator()).toBeHidden();
    await expect(processEditor.viewport().locator()).toBeHidden();
  });

  test('zoom and highlight', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page, { file: '/processes/urlparam.p.json', urlQueryParam: '&zoom=321&highlight=183E49FD86C52941-f0' });
    const start = processEditor.element('start:requestStart');
    const viewport = processEditor.viewport();
    await start.expectExecuted();
    await expect(viewport.locator()).toBeVisible();
    await viewport.expectZoomLevel('321%');
  });

  test('zoom and selectElementIds', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page, { file: '/processes/urlparam.p.json', urlQueryParam: '&zoom=123&selectElementIds=183E49FD86C52941-f0' });
    const start = processEditor.element('start:requestStart');
    const viewport = processEditor.viewport();
    await start.expectSelected();
    await expect(viewport.locator()).toBeVisible();
    await viewport.expectZoomLevel('123%');
  });

  test('theme light', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    const processEditor = await ProcessEditor.openProcess(page, { file: '/processes/urlparam.p.json' });
    await processEditor.expectDarkMode();

    const processEditor2 = await ProcessEditor.openProcess(page, { file: '/processes/urlparam.p.json', urlQueryParam: '&theme=light' });
    await processEditor2.expectLightMode();
  });

  test('theme dark', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    const processEditor = await ProcessEditor.openProcess(page, { file: '/processes/urlparam.p.json' });
    await processEditor.expectLightMode();

    const processEditor2 = await ProcessEditor.openProcess(page, { file: '/processes/urlparam.p.json', urlQueryParam: '&theme=dark' });
    await processEditor2.expectDarkMode();
  });
});
