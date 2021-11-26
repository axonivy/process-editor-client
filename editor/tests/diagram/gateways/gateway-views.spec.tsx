import 'reflect-metadata';

import { ModelRenderer, SGraph, SModelFactory, SNode, ViewRegistry } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GatewayTypes } from '../../../src/diagram/view-types';
import { setupGlobal, setupViewTestContainer } from '../../test-helper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

function createModel(graphFactory: SModelFactory): SGraph {
  const children: any[] = [];
  const gatewayNodeSize = { width: 32, height: 32 };
  children.push({ id: 'gateway', type: GatewayTypes.DEFAULT, position: { x: 500, y: 100 }, size: gatewayNodeSize });
  children.push({ id: 'gatewayTask', type: GatewayTypes.TASK, position: { x: 500, y: 150 }, size: gatewayNodeSize, args: { iconUri: 'std:Tasks' } });
  children.push({ id: 'gatewayAlternative', type: GatewayTypes.ALTERNATIVE, position: { x: 500, y: 200 }, size: gatewayNodeSize, args: { iconUri: 'std:Alternative' } });
  return graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as SGraph;
}

describe('GatewayNodeView', () => {
  let context: ModelRenderer;
  let graphFactory: SModelFactory;
  let graph: SGraph;
  let viewRegistry: ViewRegistry;

  before(() => {
    setupGlobal();
  });

  beforeEach(() => {
    [context, graphFactory, graph, viewRegistry] = setupViewTestContainer(createModel);
  });

  it('render full gateway graph', () => {
    const graphVNode = context.renderElement(graph);
    expect(toHTML(graphVNode)).to.not.include('sprotty_unknown').and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    const unknownVNode = context.renderElement(unknown);
    expect(toHTML(unknownVNode)).to.be.equal('<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0">?unknown?</text>');
  });

  it('render gateway node', () => {
    const view = viewRegistry.get(GatewayTypes.DEFAULT);
    const vnode = view.render(graph.index.getById('gateway') as SNode, context);
    const expectation = '<g><polygon class="sprotty-node" points="16,0 32,16 16,32 0,16" /><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render gateway task node', () => {
    const view = viewRegistry.get(GatewayTypes.TASK);
    const vnode = view.render(graph.index.getById('gatewayTask') as SNode, context);
    const expectation =
      '<g><polygon class="sprotty-node" points="16,0 32,16 16,32 0,16" />' +
      '<svg class="sprotty-node-decorator" height="14" width="14" x="9" y="9" viewBox="0 0 10 10">' +
      '<path fill="none" d="M5,5 m-4,0 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0 M3,5 L7,5 M5,3 L5,7" /></svg></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render gateway alternative node', () => {
    const view = viewRegistry.get(GatewayTypes.ALTERNATIVE);
    const vnode = view.render(graph.index.getById('gatewayAlternative') as SNode, context);
    const expectation =
      '<g><polygon class="sprotty-node" points="16,0 32,16 16,32 0,16" />' +
      '<svg class="sprotty-node-decorator" height="14" width="14" x="9" y="9" viewBox="0 0 10 10">' +
      '<path fill="none" d="M2,2 L8,8 M2,8 L8,2" /></svg></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });
});
