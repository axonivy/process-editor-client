import 'reflect-metadata';

import { expect } from 'chai';
import { VNode } from 'snabbdom';
import { Bounds } from 'sprotty';

import { getActivityIconDecorator, getIconDecorator } from '../../../src/diagram/icon/views';
import { setupGlobal } from '../../test-helper';

describe('Event and Gateway Icons', () => {
  before(() => {
    setupGlobal();
  });

  it('no icon', () => {
    let node = getIconDecorator('', 15);
    assertNoIcon(node);
    node = getIconDecorator('std:NoDecorator', 15);
    assertNoIcon(node);
  });

  it('svg icon', () => {
    const node = getIconDecorator('std:Signal', 20);
    expect(node.sel).to.be.equals('svg');
    expect(node.children).to.be.not.empty;
    assertIconBounds(node.data, { height: 14, width: 14, x: 13, y: 13 });

    const child = node.children![0] as any;
    expect(child.sel).to.be.equals('path');
    expect(child.data.attrs.d).to.be.equals('M5,0 L10,10 l-10,0 Z');
  });

  it('fa icon', () => {
    const node = getIconDecorator('std:Event', 25);
    assertFaIcon(node, { height: 14, width: 18, x: 17, y: 18 }, 'fa-caret-square-right');
  });

  it('img icon', () => {
    const node = getIconDecorator('/faces/javax.faces.resource/url', 30);
    assertImgIcon(node, { height: 14, width: 18, x: 22, y: 23 }, '/faces/javax.faces.resource/url');
  });
});

describe('Activity Icons', () => {
  before(() => {
    setupGlobal();
  });

  it('no icon', () => {
    let node = getActivityIconDecorator('');
    assertNoIcon(node);
    node = getActivityIconDecorator('std:NoDecorator');
    assertNoIcon(node);
  });

  it('fa icon', () => {
    const node = getActivityIconDecorator('std:Step');
    assertFaIcon(node, { height: 16, width: 20, x: 2, y: 2 }, 'fa-cog');
  });

  it('img icon', () => {
    const node = getActivityIconDecorator('/faces/javax.faces.resource/url');
    assertImgIcon(node, { height: 16, width: 20, x: 2, y: 2 }, '/faces/javax.faces.resource/url');
  });
});

function assertNoIcon(node: VNode): void {
  expect(node.sel).to.be.equals('g');
  expect(node.children).to.be.empty;
}

function assertFaIcon(node: VNode, expectedBounds: Bounds, expectedFaIcon: string): void {
  expect(node.sel).to.be.equals('g');
  expect(node.children).to.be.not.empty;

  const foreignObject = node.children![0] as any;
  expect(foreignObject.sel).to.be.equals('foreignObject');
  assertIconBounds(foreignObject.data, expectedBounds);
  expect(foreignObject.children).to.be.not.empty;

  const icon = foreignObject.children![0] as any;
  expect(icon.sel).to.be.equals('i');
  expect(icon.data.class[expectedFaIcon]).to.be.true;
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
