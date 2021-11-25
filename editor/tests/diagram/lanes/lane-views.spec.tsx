import 'reflect-metadata';

import { ModelRenderer, SGraph, SModelFactory, SNode, ViewRegistry } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { LaneTypes } from '../../../src/diagram/view-types';
import { setupGlobal, setupViewTestContainer } from '../../test-helper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

function createModel(graphFactory: SModelFactory): SGraph {
  const children: any[] = [];
  children.push({
    id: 'pool', type: LaneTypes.POOL, position: { x: 0, y: 0 }, size: { width: 800, height: 500 },
    children: [{ id: 'poolLabel', type: LaneTypes.LABEL, text: 'pool', position: { x: 0, y: 0 }, size: { width: 30, height: 500 } }]
  });
  children.push({
    id: 'pool2', type: LaneTypes.POOL, position: { x: 0, y: 0 }, size: { width: 800, height: 500 }, args: { poolLabelSpace: 38 },
    children: [{ id: 'poolLabel2', type: LaneTypes.LABEL, text: 'pool\nnew line', position: { x: 0, y: 0 }, size: { width: 30, height: 500 } }]
  });
  children.push({
    id: 'lane', type: LaneTypes.LANE, position: { x: 30, y: 0 }, size: { width: 770, height: 500 },
    children: [{ id: 'laneLabel', type: LaneTypes.LABEL, text: 'lane', position: { x: 0, y: 0 }, size: { width: 30, height: 500 } }]
  });
  return graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as SGraph;
}

describe('LaneNodeView', () => {
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

  it('render full lane graph', () => {
    const graphVNode = context.renderElement(graph);
    expect(toHTML(graphVNode)).to.not.include('sprotty_unknown')
      .and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    const unknownVNode = context.renderElement(unknown);
    expect(toHTML(unknownVNode)).to.be.equal('<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0">?unknown?</text>');
  });

  it('render pool node', () => {
    const view = viewRegistry.get(LaneTypes.POOL);
    const vnode = view.render(graph.index.getById('pool') as SNode, context);
    const expectation = '<g><rect class="sprotty-node" x="0" y="0" width="800" height="500" />'
      + '<rect class="sprotty-node" x="0" y="0" width="24" height="500" />'
      + '<text id="sprotty_poolLabel" class="sprotty-label label" transform="rotate(270) translate(-250 15)"><tspan dy="0" x="0" /></text></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render pool node with multiline label', () => {
    const view = viewRegistry.get(LaneTypes.POOL);
    const vnode = view.render(graph.index.getById('pool2') as SNode, context);
    const expectation = '<g><rect class="sprotty-node" x="0" y="0" width="800" height="500" />'
      + '<rect class="sprotty-node" x="0" y="0" width="38" height="500" />'
      + '<text id="sprotty_poolLabel2" class="sprotty-label label" transform="rotate(270) translate(-250 15)"><tspan dy="0" x="0" /><tspan dy="1.2em" x="0" /></text></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render lane node', () => {
    const view = viewRegistry.get(LaneTypes.LANE);
    const vnode = view.render(graph.index.getById('lane') as SNode, context);
    const expectation = '<g><rect class="sprotty-node" x="0" y="0" width="770" height="500" /><g></g>'
      + '<text id="sprotty_laneLabel" class="sprotty-label label" transform="rotate(270) translate(-250 15)"><tspan dy="0" x="0" /></text></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });
});
