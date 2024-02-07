import { ModelRenderer, GGraph, GModelFactory, GNode, ViewRegistry } from '@eclipse-glsp/client';
import { describe, test, expect, beforeEach } from 'vitest';
import { GatewayTypes } from '../view-types';
import { GatewayNode } from '../model';
import toHTML from 'snabbdom-to-html';
import { setupViewTestContainer } from '../../test-utils/view-container.test-util';

function createModel(graphFactory: GModelFactory): GGraph {
  const children: any[] = [];
  const gatewayNodeSize = { width: 32, height: 32 };
  children.push({ id: 'gatewayTask', type: GatewayTypes.TASK, position: { x: 500, y: 150 }, size: gatewayNodeSize });
  children.push({ id: 'gatewayAlternative', type: GatewayTypes.ALTERNATIVE, position: { x: 500, y: 200 }, size: gatewayNodeSize });
  children.push({ id: 'gatewayJoin', type: GatewayTypes.JOIN, position: { x: 500, y: 250 }, size: gatewayNodeSize });
  children.push({ id: 'gatewaySplit', type: GatewayTypes.SPLIT, position: { x: 500, y: 300 }, size: gatewayNodeSize });
  return graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as GGraph;
}

describe('GatewayNodeView', () => {
  let context: ModelRenderer;
  let graphFactory: GModelFactory;
  let graph: GGraph;
  let viewRegistry: ViewRegistry;

  beforeEach(() => {
    [context, graphFactory, graph, viewRegistry] = setupViewTestContainer(createModel);
  });

  test('render full gateway graph', () => {
    const graphVNode = context.renderElement(graph);
    expect(toHTML(graphVNode)).to.not.include('sprotty_unknown').and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    const unknownVNode = context.renderElement(unknown);
    expect(toHTML(unknownVNode)).to.be.equal(
      '<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0" data-svg-metadata-api="true" data-svg-metadata-type="unknown">?unknown?</text>'
    );
  });

  test('render task', () => {
    assertGateway(GatewayTypes.TASK, 'gatewayTask');
  });

  test('render alternative', () => {
    assertGateway(GatewayTypes.ALTERNATIVE, 'gatewayAlternative');
  });

  test('render join', () => {
    assertGateway(GatewayTypes.JOIN, 'gatewayJoin');
  });

  test('render split', () => {
    assertGateway(GatewayTypes.SPLIT, 'gatewaySplit');
  });

  test('render with execution badge', () => {
    const view = viewRegistry.get(GatewayTypes.TASK);
    const task = graph.index.getById('gatewayTask') as GatewayNode;
    task.executionCount = 3;
    const vnode = view.render(task, context);
    const executionBadge =
      '<g><rect class="execution-badge" rx="7" ry="7" x="21" y="-7" width="22" height="14" /><text class="execution-text" x="32" dy=".4em">3</text></g>';
    expect(toHTML(vnode)).to.contains(executionBadge);
  });

  test('render with color', () => {
    const view = viewRegistry.get(GatewayTypes.TASK);
    const task = graph.index.getById('gatewayTask') as GatewayNode;
    task.args = { color: 'red' };
    const vnode = view.render(task, context);
    const colorPolygon = /<polygon.*style="stroke: red".*\/>/;
    expect(toHTML(vnode)).to.matches(colorPolygon);
  });

  function assertGateway(type: string, nodeId: string): void {
    const view = viewRegistry.get(type);
    const vnode = view.render(graph.index.getById(nodeId) as GNode, context);
    const node = toHTML(vnode);
    expect(node).to.contains('<polygon class="sprotty-node" points="16,0 32,16 16,32 0,16" style="stroke: " />');
    expect(node).to.contains('<svg class="sprotty-icon-svg" viewBox="0 0 20 20" height="14" width="18" x="7" y="9">');
  }
});
