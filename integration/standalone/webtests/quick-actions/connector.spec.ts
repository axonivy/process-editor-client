import { expect, type Locator, type Page, test } from '@playwright/test';
import { endSelector, resetSelection } from '../diagram-util';
import { addActivity } from '../toolbar-util';
import { gotoRandomTestProcessUrl } from '../process-editor-url-util';
import { assertQuickActionsCount, clickQuickAction, clickQuickActionStartsWith, editLabel } from './quick-actions-util';

test.describe('quick actions - connectors', () => {
  const STRAIGHT_CONNECTOR_PATH = /M \d+.?\d*,\d+.?\d* L \d+.?\d*,\d+.?\d*/;
  const BEND_CONNECTOR_PATH = /M \d+,\d+ L \d+,\d+ L \d+,\d+ L \d+,\d+/;

  test.beforeEach(async ({ page }) => {
    await gotoRandomTestProcessUrl(page);
  });

  test('connector actions', async ({ page }) => {
    const connector = page.locator('.sprotty-graph > g > .sprotty-edge');

    await assertQuickActionsCount(page, 0);
    await connector.click();
    await assertQuickActionsCount(page, 7);
  });

  test('connector label edit', async ({ page }) => {
    const connector = page.locator('.sprotty-graph > g > .sprotty-edge');
    await editConnectorLabel(page, connector);
  });

  test('connector delete', async ({ page }) => {
    const connector = page.locator('.sprotty-graph > g > .sprotty-edge');
    await deleteConnector(page, connector);
    await expect(connector).toBeHidden();
  });

  test('connector bend and straigthen', async ({ page }) => {
    const endElement = page.locator(endSelector);
    await endElement.dragTo(page.locator('.sprotty-graph'));
    const connector = page.locator('.sprotty-graph > g > .sprotty-edge');
    const connectorPath = page.locator('.sprotty-graph > g > .sprotty-edge > path').first();
    await expect(connectorPath).toHaveAttribute('d', STRAIGHT_CONNECTOR_PATH);

    await connector.click();
    await clickQuickActionStartsWith(page, 'Straighten');
    await expect(connectorPath).toHaveAttribute('d', STRAIGHT_CONNECTOR_PATH);

    await resetSelection(page);
    await connector.click();
    await clickQuickActionStartsWith(page, 'Bend');
    await expect(connectorPath).toHaveAttribute('d', BEND_CONNECTOR_PATH);

    await resetSelection(page);
    await connector.click();
    await clickQuickActionStartsWith(page, 'Straighten');
    await expect(connectorPath).toHaveAttribute('d', STRAIGHT_CONNECTOR_PATH);
  });

  test('connector reconnect', async ({ page }) => {
    await addActivity(page, 'User Dialog', 200, 200);
    const hd = page.locator('.dialogCall');
    const connector = page.locator('.sprotty-graph > g > .sprotty-edge:not(.feedback-edge)');
    const connectorPath = page.locator('.sprotty-graph > g > .sprotty-edge:not(.feedback-edge) > path').first();
    const connectorFeedback = page.locator('.sprotty-graph > g > .sprotty-edge.feedback-edge');
    await expect(connector).toBeVisible();
    await expect(connectorFeedback).toBeHidden();
    const oldConnectorPath = (await connectorPath.getAttribute('d')) ?? '';

    await connector.click();
    await clickQuickActionStartsWith(page, 'Reconnect');
    await expect(connector).toBeVisible();
    await expect(connectorFeedback).toBeVisible();

    await hd.click();
    await expect(connector).toBeVisible();
    await expect(connectorFeedback).toBeHidden();
    await expect(connectorPath).not.toHaveAttribute('d', oldConnectorPath);
  });

  async function editConnectorLabel(page: Page, connector: Locator): Promise<void> {
    await editLabel(page, connector);
    await expect(connector.locator('.sprotty-label div')).toHaveText('test label');
  }

  async function deleteConnector(page: Page, connector: Locator): Promise<void> {
    await connector.click();
    await clickQuickAction(page, 'Delete');
  }
});
