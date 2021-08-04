import 'reflect-metadata';

import { ModelRenderer, SGraph, SModelFactory, SNode, ViewRegistry } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GatewayTypes } from '../view-types';
import setupViewTestContainer from '../views.spec';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;

function createModel(graphFactory: SModelFactory): SGraph {
  const children: any[] = [];
  const gatewayNodeSize = { width: 32, height: 32 };
  children.push({ id: 'gateway', type: GatewayTypes.DEFAULT, position: { x: 500, y: 100 }, size: gatewayNodeSize });
  children.push({ id: 'gatewayTask', type: GatewayTypes.TASK, position: { x: 500, y: 150 }, size: gatewayNodeSize });
  children.push({ id: 'gatewayAlternative', type: GatewayTypes.ALTERNATIVE, position: { x: 500, y: 200 }, size: gatewayNodeSize });
  return graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as SGraph;
}

describe('GatewayNodeView', () => {
  let context: ModelRenderer;
  let graphFactory: SModelFactory;
  let graph: SGraph;
  let viewRegistry: ViewRegistry;

  beforeEach(() => {
    [context, graphFactory, graph, viewRegistry] = setupViewTestContainer(createModel);
  });

  it('render full gateway graph', () => {
    const graphVNode = context.renderElement(graph);
    expect(toHTML(graphVNode)).to.not.include('sprotty_unknown')
      .and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    const unknownVNode = context.renderElement(unknown);
    expect(toHTML(unknownVNode)).to.be.equal('<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0">?unknown?</text>');
  });

  it('render gateway node', () => {
    const view = viewRegistry.get(GatewayTypes.DEFAULT);
    const vnode = view.render(graph.index.getById('gateway') as SNode, context);
    const expectation = '<g><polygon class="sprotty-node" points="16,0 32,16 16,32 0,16" /><g>'
      + '<line class="sprotty-node-decorator" x1="16" y1="11" x2="16" y2="21" />'
      + '<line class="sprotty-node-decorator" x1="11" y1="16" x2="21" y2="16" /></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render gateway task node', () => {
    const view = viewRegistry.get(GatewayTypes.TASK);
    const vnode = view.render(graph.index.getById('gatewayTask') as SNode, context);
    const expectation = '<g><polygon class="sprotty-node" points="16,0 32,16 16,32 0,16" /><g>'
      + '<circle class="sprotty-node sprotty-task-node" r="8" cx="16" cy="16" />'
      + '<line class="sprotty-node-decorator" x1="16" y1="11" x2="16" y2="21" />'
      + '<line class="sprotty-node-decorator" x1="11" y1="16" x2="21" y2="16" /></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render gateway alternative node', () => {
    const view = viewRegistry.get(GatewayTypes.ALTERNATIVE);
    const vnode = view.render(graph.index.getById('gatewayAlternative') as SNode, context);
    const expectation = '<g><polygon class="sprotty-node" points="16,0 32,16 16,32 0,16" /><g>'
      + '<line class="sprotty-node-decorator" x1="11" y1="11" x2="21" y2="21" />'
      + '<line class="sprotty-node-decorator" x1="11" y1="21" x2="21" y2="11" /></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });
});
