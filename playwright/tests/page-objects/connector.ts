import { expect, type Locator, type Page } from '@playwright/test';
import { BaseElement } from './element';

const STRAIGHT_CONNECTOR_PATH = /M \d+.?\d*,\d+.?\d* L \d+.?\d*,\d+.?\d*/;
const BEND_CONNECTOR_PATH = /M \d+,\d+ L \d+,\d+ L \d+,\d+ L \d+,\d+/;

export class Connector extends BaseElement {
  protected readonly feedbackEdge: Locator;
  protected readonly edgePath: Locator;

  constructor(page: Page, parentLocator: Locator) {
    super(page);
    this.element = parentLocator.locator('g.sprotty-edge:not(.feedback-edge)');
    this.feedbackEdge = parentLocator.locator('g.sprotty-edge.feedback-edge');
    this.edgePath = this.element.locator('> path').first();
    this.colorLocator = this.edgePath;
    this.labelLocator = this.element.locator('.sprotty-label div');
  }

  feedbackLocator() {
    return this.feedbackEdge;
  }

  async expectStraightPath() {
    await this.expectPath(STRAIGHT_CONNECTOR_PATH);
  }

  async expectBendPath() {
    await this.expectPath(BEND_CONNECTOR_PATH);
  }

  async expectPath(path: string | RegExp) {
    await expect(this.edgePath).toHaveAttribute('d', path);
  }

  async expectPathIsNot(path: string | RegExp) {
    await expect(this.edgePath).not.toHaveAttribute('d', path);
  }

  async getPath() {
    return (await this.edgePath.getAttribute('d')) ?? '';
  }
}
