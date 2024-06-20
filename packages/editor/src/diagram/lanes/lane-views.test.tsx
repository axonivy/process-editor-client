/* eslint-disable max-len */
import { ModelRenderer, GGraph, GModelFactory, GNode, ViewRegistry } from '@eclipse-glsp/client';
import { describe, test, expect, beforeEach } from 'vitest';
import { LaneTypes } from '../view-types';
import { LaneNode } from '../model';
import { setupViewTestContainer } from '../../test-utils/view-container.test-util';
import toHTML from 'snabbdom-to-html';

function createModel(graphFactory: GModelFactory): GGraph {
  const children: any[] = [];
  children.push({
    id: 'pool',
    type: LaneTypes.POOL,
    position: { x: 0, y: 0 },
    size: { width: 800, height: 500 },
    children: [{ id: 'poolLabel', type: LaneTypes.LABEL, text: 'pool', position: { x: 0, y: 0 }, size: { width: 30, height: 500 } }]
  });
  children.push({
    id: 'pool2',
    type: LaneTypes.POOL,
    position: { x: 0, y: 0 },
    size: { width: 800, height: 500 },
    args: { poolLabelSpace: 38 },
    children: [
      { id: 'poolLabel2', type: LaneTypes.LABEL, text: 'pool\nnew line', position: { x: 0, y: 0 }, size: { width: 30, height: 500 } }
    ]
  });
  children.push({
    id: 'lane',
    type: LaneTypes.LANE,
    position: { x: 30, y: 0 },
    size: { width: 770, height: 500 },
    children: [{ id: 'laneLabel', type: LaneTypes.LABEL, text: 'lane', position: { x: 0, y: 0 }, size: { width: 30, height: 500 } }]
  });
  return graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as GGraph;
}

describe('LaneNodeView', () => {
  let context: ModelRenderer;
  let graphFactory: GModelFactory;
  let graph: GGraph;
  let viewRegistry: ViewRegistry;

  beforeEach(() => {
    [context, graphFactory, graph, viewRegistry] = setupViewTestContainer(createModel);
  });

  test('render full lane graph', () => {
    const graphVNode = context.renderElement(graph);
    expect(toHTML(graphVNode)).to.not.include('sprotty_unknown').and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    const unknownVNode = context.renderElement(unknown);
    expect(toHTML(unknownVNode)).to.be.equal(
      '<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0" data-svg-metadata-api="true" data-svg-metadata-type="unknown">missing &quot;unknown&quot; view</text>'
    );
  });

  test('render pool node', () => {
    const view = viewRegistry.get(LaneTypes.POOL);
    const vnode = view.render(graph.index.getById('pool') as GNode, context);
    const expectation =
      '<g><rect class="sprotty-node" x="0" y="0" rx="4px" ry="4px" width="800" height="499" />' +
      '<path class="sprotty-node pool-label-rect" d="M23,0 v499 h-19 q-4,0 -4,-4 v-491 q0,-4 4,-4 z" />' +
      '<text id="sprotty_poolLabel" class="sprotty-label label" transform="rotate(270) translate(-250 15)" data-svg-metadata-type="lanes:label" data-svg-metadata-parent-id="sprotty_pool">' +
      '<tspan dy="0" x="0" /></text></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  test('render pool node with multiline label', () => {
    const view = viewRegistry.get(LaneTypes.POOL);
    const vnode = view.render(graph.index.getById('pool2') as GNode, context);
    const expectation =
      '<g><rect class="sprotty-node" x="0" y="0" rx="4px" ry="4px" width="800" height="499" />' +
      '<path class="sprotty-node pool-label-rect" d="M37,0 v499 h-33 q-4,0 -4,-4 v-491 q0,-4 4,-4 z" />' +
      '<text id="sprotty_poolLabel2" class="sprotty-label label" transform="rotate(270) translate(-250 15)" data-svg-metadata-type="lanes:label" data-svg-metadata-parent-id="sprotty_pool2">' +
      '<tspan dy="0" x="0" /><tspan dy="1.2em" x="0" /></text></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  test('render lane node', () => {
    const view = viewRegistry.get(LaneTypes.LANE);
    const vnode = view.render(graph.index.getById('lane') as GNode, context);
    const expectation =
      '<g><rect class="sprotty-node" x="0" y="0" rx="4px" ry="4px" width="770" height="499" /><g></g>' +
      '<text id="sprotty_laneLabel" class="sprotty-label label" transform="rotate(270) translate(-250 15)" data-svg-metadata-type="lanes:label" data-svg-metadata-parent-id="sprotty_lane">' +
      '<tspan dy="0" x="0" /></text></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  test('render lane with color dot', () => {
    const view = viewRegistry.get(LaneTypes.LANE);
    const lane = graph.index.getById('lane') as LaneNode;
    lane.args = { color: 'red' };
    const vnode = view.render(lane, context);
    expect(toHTML(vnode)).to.contain('style="--lane-color: red"');
  });
});
