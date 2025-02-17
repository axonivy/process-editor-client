import { describe, it, expect, beforeAll } from 'vitest';
import { type VNode } from 'snabbdom';
import { Bounds } from '@eclipse-glsp/client';

import { getActivityIconDecorator, getIconDecorator } from './views';
import { setupGlobal } from '../../test-utils/test-helper';
import { GatewayTypes, EventStartTypes, ActivityTypes } from '../view-types';
import { SvgIcons } from './icons';

describe('Event and Gateway Icons', () => {
  beforeAll(() => {
    setupGlobal();
  });

  it('no icon', () => {
    let node = getIconDecorator('', 15, '');
    assertNoIcon(node);
    node = getIconDecorator('std:NoDecorator', 15, 'red');
    assertNoIcon(node);
  });

  it('icon', () => {
    let node = getIconDecorator(GatewayTypes.ALTERNATIVE, 25, '');
    assertIcon(node, { height: 14, width: 18, x: 16, y: 18 }, SvgIcons.ALTERNATIVE, '');
    node = getIconDecorator(EventStartTypes.START_ERROR, 25, 'red');
    assertIcon(node, { height: 14, width: 18, x: 16, y: 18 }, SvgIcons.ERROR_EVENT, 'red');
  });

  it('img icon', () => {
    let node = getIconDecorator('/faces/javax.faces.resource/url', 30, '');
    assertImgIcon(node, { height: 14, width: 18, x: 21, y: 23 }, '/faces/javax.faces.resource/url');
    node = getIconDecorator('/faces/javax.faces.resource/url', 30, 'red');
    assertImgIcon(node, { height: 14, width: 18, x: 21, y: 23 }, '/faces/javax.faces.resource/url');
  });
});

describe('Activity Icons', () => {
  beforeAll(() => {
    setupGlobal();
  });

  it('no icon', () => {
    let node = getActivityIconDecorator('', '');
    assertNoIcon(node);
    node = getActivityIconDecorator('std:NoDecorator', 'red');
    assertNoIcon(node);
  });

  it('icon', () => {
    let node = getActivityIconDecorator(ActivityTypes.SCRIPT, '');
    assertIcon(node, { height: 14, width: 14, x: 4, y: 3 }, SvgIcons.SCRIPT);
    node = getActivityIconDecorator(ActivityTypes.SCRIPT, 'red');
    assertIcon(node, { height: 14, width: 14, x: 4, y: 3 }, SvgIcons.SCRIPT, 'red');
  });

  it('img icon', () => {
    let node = getActivityIconDecorator('/faces/javax.faces.resource/url', '');
    assertImgIcon(node, { height: 14, width: 14, x: 4, y: 3 }, '/faces/javax.faces.resource/url');
    node = getActivityIconDecorator('/faces/javax.faces.resource/url', 'red');
    assertImgIcon(node, { height: 14, width: 14, x: 4, y: 3 }, '/faces/javax.faces.resource/url');
  });
});

function assertNoIcon(node: VNode): void {
  expect(node.sel).to.be.equals('g');
  expect(node.children).toEqual([]);
}

function assertIcon(node: VNode, expectedBounds: Bounds, expectedPath: string, color?: string): void {
  expect(node.sel).to.be.equals('svg');
  expect(node.children).not.toEqual([]);
  assertIconBounds(node.data, expectedBounds, '0 0 20 20');

  const path = node.children![0] as any;
  expect(path.sel).to.be.equals('path');
  expect(path.data.attrs.d).to.be.equals(expectedPath);

  if (color) {
    expect(path.data.style.fill).to.be.equals(color);
  }
}

function assertImgIcon(node: VNode, expectedBounds: Bounds, exprectedUrl: string): void {
  expect(node.sel).to.be.equals('g');
  expect(node.children).not.toEqual([]);

  const foreignObject = node.children![0] as any;
  expect(foreignObject.sel).to.be.equals('foreignObject');
  assertIconBounds(foreignObject.data, expectedBounds);
  expect(foreignObject.children).not.toEqual([]);

  const icon = foreignObject.children![0] as any;
  expect(icon.sel).to.be.equals('img');
  expect(icon.data.attrs.src).to.be.equals(exprectedUrl);
}

function assertIconBounds(data: any, expectedBounds: Bounds, viewBox?: string): void {
  expect(data.attrs.height).to.be.equals(expectedBounds.height);
  expect(data.attrs.width).to.be.equals(expectedBounds.width);
  expect(data.attrs.x).to.be.equals(expectedBounds.x);
  expect(data.attrs.y).to.be.equals(expectedBounds.y);
  if (viewBox) {
    expect(data.attrs.viewBox).to.be.equals(viewBox);
  }
}
