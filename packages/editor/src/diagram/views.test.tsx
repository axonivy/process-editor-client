import { ModelRenderer, GEdge, GGraph, GModelFactory, ViewRegistry } from '@eclipse-glsp/client';
import { describe, test, expect, beforeEach } from 'vitest';
import { ActivityTypes, EdgeTypes, EventStartTypes, EventEndTypes } from './view-types';
import { Edge } from './model';
import toHTML from 'snabbdom-to-html';
import { setupViewTestContainer } from '../test-utils/view-container.test-util';

function createModel(graphFactory: GModelFactory): GGraph {
  const children: any[] = [];
  children.push({ id: 'start', type: EventStartTypes.START, position: { x: 100, y: 100 }, size: { width: 30, height: 30 } });
  children.push({ id: 'end', type: EventEndTypes.END, position: { x: 200, y: 100 }, size: { width: 30, height: 30 } });
  children.push({ id: 'comment', type: ActivityTypes.COMMENT, position: { x: 600, y: 100 }, size: { width: 150, height: 50 } });
  children.push({ id: 'script', type: ActivityTypes.SCRIPT, position: { x: 600, y: 150 }, size: { width: 150, height: 50 } });

  children.push({ id: 'edge', type: EdgeTypes.DEFAULT, sourceId: 'start', targetId: 'end' });
  children.push({ id: 'edgeWithRoutes', type: EdgeTypes.DEFAULT, sourceId: 'start', targetId: 'end', routingPoints: [{ x: 150, y: 500 }] });
  children.push({ id: 'edgeWithPadding', type: EdgeTypes.DEFAULT, sourceId: 'start', targetId: 'end', args: { edgePadding: 5 } });
  children.push({ id: 'assoziation', type: EdgeTypes.ASSOCIATION, sourceId: 'script', targetId: 'comment' });
  return graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as GGraph;
}

describe('EdgeView', () => {
  let context: ModelRenderer;
  let graphFactory: GModelFactory;
  let graph: GGraph;
  let viewRegistry: ViewRegistry;

  beforeEach(() => {
    [context, graphFactory, graph, viewRegistry] = setupViewTestContainer(createModel);
  });

  test('render full edge graph', () => {
    const graphVNode = context.renderElement(graph);
    expect(toHTML(graphVNode)).to.not.include('sprotty_unknown').and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    const unknownVNode = context.renderElement(unknown);
    expect(toHTML(unknownVNode)).to.be.equal(
      '<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0" data-svg-metadata-api="true" data-svg-metadata-type="unknown">missing &quot;unknown&quot; view</text>'
    );
  });

  test('render edge', () => {
    const view = viewRegistry.get(EdgeTypes.DEFAULT);
    const vnode = view.render(graph.index.getById('edge') as GEdge, context);
    const expectation =
      '<g class="sprotty-edge"><path d="M 130,115 L 200,115" />' +
      '<path class="sprotty-edge arrow" d="M 0.5,0 L 6,-3 L 6,3 Z" transform="rotate(180 200 115) translate(200 115)" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  test('render edge with routing points', () => {
    const view = viewRegistry.get(EdgeTypes.DEFAULT);
    const vnode = view.render(graph.index.getById('edgeWithRoutes') as GEdge, context);
    const expectation =
      '<g class="sprotty-edge"><path d="M 116.35803619063778,129.93839809701555 L 150,500 L 212.5028714424112,129.79068453341068" />' +
      '<path class="sprotty-edge arrow" d="M 0.5,0 L 6,-3 L 6,3 Z" transform="rotate(99.58294472353258 212.5028714424112 129.79068453341068) ' +
      'translate(212.5028714424112 129.79068453341068)" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  test('render edge with padding', () => {
    const view = viewRegistry.get(EdgeTypes.DEFAULT);
    const vnode = view.render(graph.index.getById('edgeWithPadding') as GEdge, context);
    const mouseHandle =
      '<path class="mouse-handle" d="M 130,115 L 200,115" style="stroke-width: 10; stroke: transparent; stroke-dasharray: none; stroke-dashoffset: 0" />';
    expect(toHTML(vnode)).to.contains(mouseHandle);
  });

  test('render edge assoziation', () => {
    const view = viewRegistry.get(EdgeTypes.ASSOCIATION);
    const vnode = view.render(graph.index.getById('assoziation') as GEdge, context);
    const expectation = '<g class="sprotty-edge"><path d="M 675,150 L 675,150" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  test('render edge with color', () => {
    const view = viewRegistry.get(EdgeTypes.DEFAULT);
    const edge = graph.index.getById('edge') as Edge;
    edge.args = { color: 'red' };
    const vnode = view.render(edge, context);
    const color = 'style="stroke: red"';
    expect(toHTML(vnode)).to.contain(color);
  });
});
