import 'reflect-metadata';

import {
  configureModelElement,
  defaultModule,
  DefaultTypes,
  GLSPGraph,
  graphModule,
  IVNodePostprocessor,
  ModelRenderer,
  ModelRendererFactory,
  moveModule,
  routingModule,
  SEdge,
  selectModule,
  SGraph,
  SGraphView,
  SModelFactory,
  TYPES,
  ViewRegistry
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container } from 'inversify';
import { describe, it } from 'mocha';

import ivyDiagramModule from './di.config';
import { ActivityTypes, EdgeTypes, EventTypes } from './view-types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;

const setupViewTestContainer = (modelFactory: any): [ModelRenderer, SModelFactory, any, ViewRegistry] => {
  const container = new Container();
  container.load(defaultModule, selectModule, moveModule, graphModule, routingModule, ivyDiagramModule);
  configureModelElement(container, DefaultTypes.GRAPH, GLSPGraph, SGraphView);
  const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
  const context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
  const graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
  const viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
  const graph = modelFactory(graphFactory);
  return [context, graphFactory, graph, viewRegistry];
};

function createModel(graphFactory: SModelFactory): SGraph {
  const children: any[] = [];
  children.push({ id: 'start', type: EventTypes.START, position: { x: 100, y: 100 }, size: { width: 30, height: 30 } });
  children.push({ id: 'end', type: EventTypes.END, position: { x: 200, y: 100 }, size: { width: 30, height: 30 } });
  children.push({ id: 'comment', type: ActivityTypes.COMMENT, position: { x: 600, y: 100 }, size: { width: 150, height: 50 } });
  children.push({ id: 'script', type: ActivityTypes.SCRIPT, position: { x: 600, y: 150 }, size: { width: 150, height: 50 } });

  children.push({ id: 'edge', type: EdgeTypes.DEFAULT, sourceId: 'start', targetId: 'end' });
  children.push({ id: 'edgeWithRoutes', type: EdgeTypes.DEFAULT, sourceId: 'start', targetId: 'end', routingPoints: [{ x: 150, y: 500 }] });
  children.push({ id: 'edgeWithPadding', type: EdgeTypes.DEFAULT, sourceId: 'start', targetId: 'end', args: { edgePadding: 5 } });
  children.push({ id: 'assoziation', type: EdgeTypes.ASSOCIATION, sourceId: 'script', targetId: 'comment' });
  return graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as SGraph;
}

describe('EdgeView', () => {
  let context: ModelRenderer;
  let graphFactory: SModelFactory;
  let graph: SGraph;
  let viewRegistry: ViewRegistry;

  beforeEach(() => {
    [context, graphFactory, graph, viewRegistry] = setupViewTestContainer(createModel);
  });

  it('render full edge graph', () => {
    const graphVNode = context.renderElement(graph);
    expect(toHTML(graphVNode)).to.not.include('sprotty_unknown')
      .and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    const unknownVNode = context.renderElement(unknown);
    expect(toHTML(unknownVNode)).to.be.equal('<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0">?unknown?</text>');
  });

  it('render edge', () => {
    const view = viewRegistry.get(EdgeTypes.DEFAULT);
    const vnode = view.render(graph.index.getById('edge') as SEdge, context);
    const expectation = '<g class="sprotty-edge"><path d="M 130,115 L 200,115" />'
      + '<path class="sprotty-edge arrow" d="M 1.5,0 L 10,-4 L 10,4 Z" transform="rotate(180 200 115) translate(200 115)" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render edge with routing points', () => {
    const view = viewRegistry.get(EdgeTypes.DEFAULT);
    const vnode = view.render(graph.index.getById('edgeWithRoutes') as SEdge, context);
    const expectation = '<g class="sprotty-edge"><path d="M 116.35803619063778,129.93839809701555 L 150,500 L 212.5028714424112,129.79068453341068" />'
      + '<path class="sprotty-edge arrow" d="M 1.5,0 L 10,-4 L 10,4 Z" transform="rotate(99.58294472353258 212.5028714424112 129.79068453341068) '
      + 'translate(212.5028714424112 129.79068453341068)" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render edge with padding', () => {
    const view = viewRegistry.get(EdgeTypes.DEFAULT);
    const vnode = view.render(graph.index.getById('edgeWithPadding') as SEdge, context);
    const expectation = '<g class="sprotty-edge"><path d="M 130,115 L 200,115" />'
      + '<path class="mouse-handle" d="M 130,115 L 200,115" style="stroke-width: 10; stroke: transparent; stroke-dasharray: none; stroke-dashoffset: 0" />'
      + '<path class="sprotty-edge arrow" d="M 1.5,0 L 10,-4 L 10,4 Z" transform="rotate(180 200 115) translate(200 115)" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render edge assoziation', () => {
    const view = viewRegistry.get(EdgeTypes.ASSOCIATION);
    const vnode = view.render(graph.index.getById('assoziation') as SEdge, context);
    const expectation = '<g class="sprotty-edge"><path d="M 675,150 L 675,150" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });
});

export default setupViewTestContainer;
