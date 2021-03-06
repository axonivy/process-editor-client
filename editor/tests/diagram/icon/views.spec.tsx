import 'reflect-metadata';

import { expect } from 'chai';
import { VNode } from 'snabbdom';
import { Bounds } from '@eclipse-glsp/client';

import { getActivityIconDecorator, getIconDecorator } from '../../../src/diagram/icon/views';
import { setupGlobal } from '../../test-helper';

describe('Event and Gateway Icons', () => {
  before(() => {
    setupGlobal();
  });

  it('no icon', () => {
    let node = getIconDecorator('', 15, '');
    assertNoIcon(node);
    node = getIconDecorator('std:NoDecorator', 15, 'red');
    assertNoIcon(node);
  });

  it('svg icon', () => {
    let node = getIconDecorator('std:Signal', 20, '');
    assertSvgIcon(node);
    node = getIconDecorator('std:Signal', 20, 'red');
    assertSvgIcon(node, 'red');
  });

  it('fa icon', () => {
    let node = getIconDecorator('std:Event', 25, '');
    assertFaIcon(node, { height: 14, width: 18, x: 17, y: 18 }, 'fa-caret-square-right');
    node = getIconDecorator('std:Event', 25, 'red');
    assertFaIcon(node, { height: 14, width: 18, x: 17, y: 18 }, 'fa-caret-square-right', 'red');
  });

  it('img icon', () => {
    let node = getIconDecorator('/faces/javax.faces.resource/url', 30, '');
    assertImgIcon(node, { height: 14, width: 18, x: 22, y: 23 }, '/faces/javax.faces.resource/url');
    node = getIconDecorator('/faces/javax.faces.resource/url', 30, 'red');
    assertImgIcon(node, { height: 14, width: 18, x: 22, y: 23 }, '/faces/javax.faces.resource/url');
  });
});

describe('Activity Icons', () => {
  before(() => {
    setupGlobal();
  });

  it('no icon', () => {
    let node = getActivityIconDecorator('', '');
    assertNoIcon(node);
    node = getActivityIconDecorator('std:NoDecorator', 'red');
    assertNoIcon(node);
  });

  it('fa icon', () => {
    let node = getActivityIconDecorator('std:Step', '');
    assertFaIcon(node, { height: 12, width: 14, x: 4, y: 3 }, 'fa-cog');
    node = getActivityIconDecorator('std:Step', 'red');
    assertFaIcon(node, { height: 12, width: 14, x: 4, y: 3 }, 'fa-cog', 'red');
  });

  it('img icon', () => {
    let node = getActivityIconDecorator('/faces/javax.faces.resource/url', '');
    assertImgIcon(node, { height: 12, width: 14, x: 4, y: 3 }, '/faces/javax.faces.resource/url');
    node = getActivityIconDecorator('/faces/javax.faces.resource/url', 'red');
    assertImgIcon(node, { height: 12, width: 14, x: 4, y: 3 }, '/faces/javax.faces.resource/url');
  });
});

function assertNoIcon(node: VNode): void {
  expect(node.sel).to.be.equals('g');
  expect(node.children).to.be.empty;
}

function assertSvgIcon(node: VNode, color?: string): void {
  expect(node.sel).to.be.equals('svg');
  expect(node.children).to.be.not.empty;
  assertIconBounds(node.data, { height: 14, width: 14, x: 13, y: 13 });

  const child = node.children![0] as any;
  expect(child.sel).to.be.equals('path');
  expect(child.data.attrs.d).to.be.equals('M5,0 L10,10 l-10,0 Z');

  if (color) {
    expect(child.data.style.stroke).to.be.equals(color);
  }
}

function assertFaIcon(node: VNode, expectedBounds: Bounds, expectedFaIcon: string, color?: string): void {
  expect(node.sel).to.be.equals('g');
  expect(node.children).to.be.not.empty;

  const foreignObject = node.children![0] as any;
  expect(foreignObject.sel).to.be.equals('foreignObject');
  assertIconBounds(foreignObject.data, expectedBounds);
  expect(foreignObject.children).to.be.not.empty;

  const icon = foreignObject.children![0] as any;
  expect(icon.sel).to.be.equals('i');
  expect(icon.data.class[expectedFaIcon]).to.be.true;

  if (color) {
    expect(icon.data.style.color).to.be.equals(color);
  }
}

function assertImgIcon(node: VNode, expectedBounds: Bounds, exprectedUrl: string): void {
  expect(node.sel).to.be.equals('g');
  expect(node.children).to.be.not.empty;

  const foreignObject = node.children![0] as any;
  expect(foreignObject.sel).to.be.equals('foreignObject');
  assertIconBounds(foreignObject.data, expectedBounds);
  expect(foreignObject.children).to.be.not.empty;

  const icon = foreignObject.children![0] as any;
  expect(icon.sel).to.be.equals('img');
  expect(icon.data.attrs.src).to.be.equals(exprectedUrl);
}

function assertIconBounds(data: any, expectedBounds: Bounds): void {
  expect(data.attrs.height).to.be.equals(expectedBounds.height);
  expect(data.attrs.width).to.be.equals(expectedBounds.width);
  expect(data.attrs.x).to.be.equals(expectedBounds.x);
  expect(data.attrs.y).to.be.equals(expectedBounds.y);
}
