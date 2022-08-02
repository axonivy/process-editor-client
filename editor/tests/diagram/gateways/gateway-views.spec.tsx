import 'reflect-metadata';

import { ModelRenderer, SGraph, SModelFactory, SNode, ViewRegistry } from '@eclipse-glsp/client';
import { expect } from 'chai';

import { GatewayTypes } from '../../../src/diagram/view-types';
import { setupGlobal, setupViewTestContainer } from '../../test-helper';
import { GatewayNode } from '../../../src/diagram/model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

function createModel(graphFactory: SModelFactory): SGraph {
  const children: any[] = [];
  const gatewayNodeSize = { width: 32, height: 32 };
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

  it('render task', () => {
    const view = viewRegistry.get(GatewayTypes.TASK);
    const vnode = view.render(graph.index.getById('gatewayTask') as SNode, context);
    const expectation =
      '<g><polygon class="sprotty-node" points="16,0 32,16 16,32 0,16" style="stroke: " />' +
      '<svg class="sprotty-node-decorator" height="14" width="14" x="9" y="9" viewBox="0 0 10 10">' +
      '<path d="M5,5 m-4,0 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0 M3,5 L7,5 M5,3 L5,7" style="stroke: " /></svg><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render alternative', () => {
    const view = viewRegistry.get(GatewayTypes.ALTERNATIVE);
    const vnode = view.render(graph.index.getById('gatewayAlternative') as SNode, context);
    const expectation =
      '<g><polygon class="sprotty-node" points="16,0 32,16 16,32 0,16" style="stroke: " />' +
      '<svg class="sprotty-node-decorator" height="14" width="14" x="9" y="9" viewBox="0 0 10 10">' +
      '<path d="M2,2 L8,8 M2,8 L8,2" style="stroke: " /></svg><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render with execution badge', () => {
    const view = viewRegistry.get(GatewayTypes.TASK);
    const task = graph.index.getById('gatewayTask') as GatewayNode;
    task.executionCount = 3;
    const vnode = view.render(task, context);
    const executionBadge = '<g><rect class="execution-badge" rx="7" ry="7" x="21" y="-7" width="22" height="14" /><text class="execution-text" x="32" dy=".4em">3</text></g>';
    expect(toHTML(vnode)).to.contains(executionBadge);
  });

  it('render with color', () => {
    const view = viewRegistry.get(GatewayTypes.TASK);
    const task = graph.index.getById('gatewayTask') as GatewayNode;
    task.args.color = 'red';
    const vnode = view.render(task, context);
    const colorPolygon = /<polygon.*style="stroke: red".*\/>/;
    const colorPath = /<path.*style="stroke: red".*\/>/;
    expect(toHTML(vnode)).to.matches(colorPolygon).and.matches(colorPath);
  });
});
