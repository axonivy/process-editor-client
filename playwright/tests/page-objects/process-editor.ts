import type { Locator, Page } from '@playwright/test';
import { v4 as uuid } from 'uuid';
import { expect } from '@playwright/test';
import { Activity, Element, Lane, Pool } from './element';
import { Toolbar } from './toolbar';
import { NegativeArea } from './negative-area';
import { CmdCtrl, Point } from './types';
import { Connector } from './connector';
import { QuickActionBar } from './quick-action-bar';
import { JumpOutBar } from './jump-out';
import { ViewportBar } from './viewport';
import { Inscription } from './inscription';
import { GRAPH_SELECTOR, diagramLocator, graphLocator } from './graph';

const startSelector = GRAPH_SELECTOR + ' .start\\:requestStart';

export class ProcessEditor {
  protected readonly page: Page;
  protected readonly graph: Locator;
  protected readonly diagram: Locator;
  public readonly startElement: Element;
  public readonly endElement: Element;

  constructor(page: Page) {
    this.page = page;
    this.graph = graphLocator(this.page);
    this.diagram = diagramLocator(this.page);
    this.startElement = this.element('start:requestStart');
    this.endElement = this.element('end:taskEnd');
  }

  static async openEmptyProcess(page: Page) {
    const processEditor = await this.openProcess(page);
    await processEditor.startElement.delete();
    await processEditor.endElement.delete();
    return processEditor;
  }

  static async openProcess(page: Page, options?: { urlQueryParam?: string; file?: string; waitFor?: string }) {
    await page.goto(
      ProcessEditor.processEditorUrl('glsp-test-project', options?.file ?? `/processes/test/${uuid()}.p.json`) +
        (options?.urlQueryParam ?? '')
    );
    await page.addStyleTag({ content: '.palette-body {transition: none !important;}' });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const waitForElement = page.locator(options?.waitFor ?? startSelector).first();
    // wait for start element, give a reload if was not visible the first time
    await waitForElement.waitFor({ state: 'visible', timeout: 10000 });
    if (!(await waitForElement.isVisible())) {
      await page.reload();
      await expect(waitForElement).toBeVisible();
    }
    return new ProcessEditor(page);
  }

  private static processEditorUrl(pmv: string, file: string): string {
    const app = process.env.TEST_APP ?? 'designer';
    return `?server=${ProcessEditor.serverUrl()}&app=${app}&pmv=${pmv}&file=${file}`;
  }

  private static serverUrl(): string {
    const server = process.env.BASE_URL ?? 'localhost:8081';
    return server.replace(/^https?:\/\//, '');
  }

  elementByPid(pid: string) {
    return new Element(this.page, this.graph, { pid });
  }

  element(type: string) {
    return new Element(this.page, this.graph, { type });
  }

  edge() {
    return new Connector(this.page, this.graph);
  }

  toolbar() {
    return new Toolbar(this.page);
  }

  viewport() {
    return new ViewportBar(this.page);
  }

  negativeArea() {
    return new NegativeArea(this.page);
  }

  quickAction() {
    return new QuickActionBar(this.page);
  }

  jumpOut() {
    return new JumpOutBar(this.page);
  }

  async createActivity(type: string, position: Point) {
    await this.toolbar().triggerCreateElement('activities', type);
    await this.clickAt(position);
    const id = (await this.graph.locator('> g > g.selected').getAttribute('id')) ?? undefined;
    return new Activity(this.page, this.graph, { id });
  }

  async createLane(position: Point) {
    await this.createArtifact('Lane', position);
    return new Lane(this.page, this.graph, { type: 'lane' });
  }

  async createPool(position: Point) {
    await this.createArtifact('Pool', position);
    return new Pool(this.page, this.graph, { type: 'pool' });
  }

  async createArtifact(type: string, position: Point) {
    await this.toolbar().triggerCreateElement('artifacts', type);
    await this.clickAt(position);
  }

  async clickAt(position: Point) {
    await this.graph.click({ position });
  }

  async copyPaste(cmdCtrl: CmdCtrl) {
    await this.page.keyboard.press(`${cmdCtrl}+C`);
    await this.page.keyboard.press(`${cmdCtrl}+V`);
  }

  async multiSelect(elements: Element[], cmdCtrl: CmdCtrl, position?: { x: number; y: number }) {
    await this.resetSelection();
    await this.page.keyboard.down(cmdCtrl);
    for (const element of elements) {
      await element.select(position);
    }
    await this.page.keyboard.up(cmdCtrl);
  }

  async resetSelection() {
    const graph = this.page.locator('#sprotty');
    await expect(graph).toBeVisible();
    const bounds = await graph.boundingBox();
    await graph.click({ position: { x: bounds!.width - 20, y: bounds!.height - 80 } });
    await expect(this.page.locator('g.selected')).toHaveCount(0);
  }

  async toggleInscription() {
    await this.page.locator('#btn_inscription_toggle').click();
    return new Inscription(this.page);
  }

  async expectDarkMode() {
    await expect(this.graph).toHaveCSS('background-color', 'rgb(60, 59, 58)');
  }

  async expectLightMode() {
    await expect(this.graph).toHaveCSS('background-color', 'rgb(250, 250, 250)');
  }

  async expectGridVisible() {
    await expect(this.diagram).toHaveClass('grid-background');
  }

  async expectGridHidden() {
    await expect(this.diagram).not.toHaveAttribute('grid-background');
  }

  async reload() {
    await this.page.reload();
  }
}
