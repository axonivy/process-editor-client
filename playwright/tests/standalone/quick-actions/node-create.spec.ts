import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';
import { Element } from '../../page-objects/element';

test.describe('quick actions - create node', () => {
  test('switch categories', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const hd = await processEditor.createActivity('User Dialog', { x: 200, y: 200 });

    await switchAndAssertGroup(hd, 'Events', ['Intermediate Events', 'End Events', 'Boundary Events']);
    await switchAndAssertGroup(hd, 'Gateways', ['Gateways']);
    await switchAndAssertGroup(hd, 'Activities', ['Workflow Activities', 'Interface Activities', 'BPMN Activities']);
  });

  async function switchAndAssertGroup(element: Element, quickAction: string, groups: string[]) {
    await element.quickActionBar().trigger(quickAction, 'startsWith');
    await element.quickActionBar().menu().expectMenuGroups(groups);
  }

  test('not all elements are listed', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.startElement;
    const end = processEditor.endElement;
    const quickAction = start.quickActionBar();
    await quickAction.trigger('Events', 'startsWith');
    await quickAction.menu().expectMenuItemCount(2);
    await end.delete();
    await quickAction.trigger('Events', 'startsWith');
    await quickAction.menu().expectMenuItemCount(5);
  });

  test('add element', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.startElement;
    const end = processEditor.endElement;
    const edge = processEditor.edge();
    await end.delete();
    await expect(edge.locator()).toBeHidden();

    await start.quickActionBar().createElement('Activities', 'User Dialog');
    await expect(processEditor.element('dialogCall').locator()).toBeVisible();
    await expect(edge.locator()).toBeVisible();
  });

  test('add element to existing connection', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.startElement;
    const edge = processEditor.edge();
    await expect(edge.locator()).toHaveCount(1);

    await start.quickActionBar().createElement('Gateways', 'Split');
    await expect(processEditor.element('split').locator()).toBeVisible();
    await expect(edge.locator()).toHaveCount(2);
  });

  test('attach comment', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.startElement;
    const comment = processEditor.element('processAnnotation');
    const edge = processEditor.edge();
    await expect(comment.locator()).not.toBeVisible();
    await expect(edge.locator()).toHaveCount(1);

    await start.quickActionBar().pressShortCut('A');
    await start.quickActionBar().menu().click('Note');
    await expect(comment.locator()).toBeVisible();
    await expect(edge.locator()).toHaveCount(2);
  });

  test('attach error boundary', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const hd = await processEditor.createActivity('User Dialog', { x: 200, y: 200 });
    const errorBoundary = processEditor.element('boundary:errorBoundaryEvent');
    await expect(errorBoundary.locator()).toBeHidden();

    await hd.quickActionBar().createElement('Events', 'Error Boundary');
    await expect(errorBoundary.locator()).toBeVisible();
  });

  test('attach signal boundary', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const userTask = await processEditor.createActivity('User Task', { x: 200, y: 200 });
    const signalBoundary = processEditor.element('boundary:signalBoundaryEvent');
    await expect(signalBoundary.locator()).toBeHidden();

    await userTask.quickActionBar().createElement('Events', 'Signal Boundary');
    await expect(signalBoundary.locator()).toBeVisible();
  });
});
