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
  SNode,
  TYPES,
  ViewRegistry
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container } from 'inversify';
import { describe, it } from 'mocha';

import ivyDiagramModule from './di.config';
import { EdgeTypes, EventTypes, GatewayTypes, LabelType, LaneTypes, NodeTypes } from './view-types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule, selectModule, moveModule, graphModule, routingModule, ivyDiagramModule);
  configureModelElement(container, DefaultTypes.GRAPH, GLSPGraph, SGraphView);
  return container;
}

function createModel(graphFactory: SModelFactory): SGraph {
  // create event nodes
  const children: any[] = [];
  const eventNodeSize = { width: 30, height: 30 };
  children.push({ id: 'start', type: EventTypes.START, position: { x: 100, y: 100 }, size: eventNodeSize });
  children.push({ id: 'startError', type: EventTypes.START_ERROR, position: { x: 100, y: 150 }, size: eventNodeSize });
  children.push({ id: 'startSignal', type: EventTypes.START_SIGNAL, position: { x: 100, y: 200 }, size: eventNodeSize });
  children.push({ id: 'end', type: EventTypes.END, position: { x: 200, y: 100 }, size: eventNodeSize });
  children.push({ id: 'endError', type: EventTypes.END_ERROR, position: { x: 200, y: 150 }, size: eventNodeSize });
  children.push({ id: 'intermediate', type: EventTypes.INTERMEDIATE, position: { x: 300, y: 100 }, size: eventNodeSize });
  children.push({ id: 'intermediateTask', type: EventTypes.INTERMEDIATE_TASK, position: { x: 300, y: 150 }, size: eventNodeSize });
  children.push({ id: 'boundaryError', type: EventTypes.BOUNDARY_ERROR, position: { x: 400, y: 100 }, size: eventNodeSize });
  children.push({ id: 'boundarySignal', type: EventTypes.BOUNDARY_SIGNAL, position: { x: 400, y: 150 }, size: eventNodeSize });

  // create gateway nodes
  const gatewayNodeSize = { width: 32, height: 32 };
  children.push({ id: 'gateway', type: GatewayTypes.DEFAULT, position: { x: 500, y: 100 }, size: gatewayNodeSize });
  children.push({ id: 'gatewayTask', type: GatewayTypes.TASK, position: { x: 500, y: 150 }, size: gatewayNodeSize });
  children.push({ id: 'gatewayAlternative', type: GatewayTypes.ALTERNATIVE, position: { x: 500, y: 200 }, size: gatewayNodeSize });

  // create task nodes
  const taskNodeSize = { width: 150, height: 50 };
  children.push({
    id: 'comment', type: NodeTypes.COMMENT, position: { x: 600, y: 100 }, size: taskNodeSize,
    children: [{ id: 'commentLabel', type: LabelType.DEFAULT, text: 'comment', position: { x: 0, y: 0 }, size: { width: 100, height: 30 } }]
  });
  children.push({ id: 'script', type: NodeTypes.SCRIPT, position: { x: 600, y: 150 }, size: taskNodeSize });
  children.push({ id: 'hd', type: NodeTypes.HD, position: { x: 600, y: 200 }, size: taskNodeSize });
  children.push({ id: 'user', type: NodeTypes.USER, position: { x: 600, y: 250 }, size: taskNodeSize });
  children.push({ id: 'soap', type: NodeTypes.SOAP, position: { x: 600, y: 300 }, size: taskNodeSize });
  children.push({ id: 'rest', type: NodeTypes.REST, position: { x: 600, y: 350 }, size: taskNodeSize });
  children.push({ id: 'db', type: NodeTypes.DB, position: { x: 600, y: 400 }, size: taskNodeSize });
  children.push({ id: 'email', type: NodeTypes.EMAIL, position: { x: 600, y: 450 }, size: taskNodeSize });
  children.push({ id: 'subProcess', type: NodeTypes.SUB_PROCESS, position: { x: 600, y: 500 }, size: taskNodeSize });
  children.push({ id: 'embeddedProcess', type: NodeTypes.EMBEDDED_PROCESS, position: { x: 600, y: 550 }, size: taskNodeSize });

  // create lane nodes
  children.push({
    id: 'pool', type: LaneTypes.POOL, position: { x: 0, y: 0 }, size: { width: 800, height: 500 },
    children: [{ id: 'poolLabel', type: LaneTypes.LABEL, text: 'pool', position: { x: 0, y: 0 }, size: { width: 30, height: 500 } }]
  });
  children.push({
    id: 'lane', type: LaneTypes.LANE, position: { x: 30, y: 0 }, size: { width: 770, height: 500 },
    children: [{ id: 'laneLabel', type: LaneTypes.LABEL, text: 'lane', position: { x: 0, y: 0 }, size: { width: 30, height: 500 } }]
  });

  // create edges
  children.push({ id: 'edge', type: EdgeTypes.DEFAULT, sourceId: 'start', targetId: 'end' });
  children.push({ id: 'edgeWithRoutes', type: EdgeTypes.DEFAULT, sourceId: 'start', targetId: 'end', routingPoints: [{ x: 150, y: 500 }] });
  children.push({ id: 'edgeWithPadding', type: EdgeTypes.DEFAULT, sourceId: 'start', targetId: 'end', args: { edgePadding: 5 } });
  children.push({ id: 'assoziation', type: EdgeTypes.ASSOCIATION, sourceId: 'script', targetId: 'comment' });

  const graph = graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as SGraph;
  return graph;
}

describe('GeneralView', () => {
  let context: ModelRenderer;
  let graphFactory: SModelFactory;
  let graph: SGraph;

  beforeEach(() => {
    const container = createContainer();
    const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
    context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
    graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
    graph = createModel(graphFactory);
  });

  it('render full graph', () => {
    const vnode = context.renderElement(graph);
    expect(toHTML(vnode)).to.not.include('sprotty_unknown')
      .and.not.include('sprotty-missing');
  });

  it('render unknown node', () => {
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    const vnode = context.renderElement(unknown);
    expect(toHTML(vnode)).to.be.equal('<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0">?unknown?</text>');
  });
});

describe('EventNodeView', () => {
  let context: ModelRenderer;
  let viewRegistry: ViewRegistry;
  let graph: SGraph;

  beforeEach(() => {
    const container = createContainer();
    const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
    context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
    const graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
    viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
    graph = createModel(graphFactory);
  });

  it('render start event node', () => {
    const view = viewRegistry.get(EventTypes.START);
    const vnode = view.render(graph.index.getById('start') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><g></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render start error event node', () => {
    const view = viewRegistry.get(EventTypes.START_ERROR);
    const vnode = view.render(graph.index.getById('startError') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><g></g>'
      + '<svg class="sprotty-node-decorator" height="14" width="14" x="8" y="8" viewBox="0 0 10 10"><path fill="none" d="M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z" /></svg></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render start signal event node', () => {
    const view = viewRegistry.get(EventTypes.START_SIGNAL);
    const vnode = view.render(graph.index.getById('startSignal') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><g></g>'
      + '<svg class="sprotty-node-decorator" height="14" width="14" x="8" y="8" viewBox="0 0 10 10"><path fill="none" d="M5,0 L10,10 l-10,0 Z" /></svg></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render end event node', () => {
    const view = viewRegistry.get(EventTypes.END);
    const vnode = view.render(graph.index.getById('end') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><g></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render end error event node', () => {
    const view = viewRegistry.get(EventTypes.END_ERROR);
    const vnode = view.render(graph.index.getById('endError') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><g></g>'
      + '<svg class="sprotty-node-decorator" height="14" width="14" x="8" y="8" viewBox="0 0 10 10"><path fill="none" d="M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z" /></svg></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render intermediate event node', () => {
    const view = viewRegistry.get(EventTypes.INTERMEDIATE);
    const vnode = view.render(graph.index.getById('intermediate') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><circle class="sprotty-node sprotty-task-node" r="12" cx="15" cy="15" /><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render intermediate task event node', () => {
    const view = viewRegistry.get(EventTypes.INTERMEDIATE_TASK);
    const vnode = view.render(graph.index.getById('intermediateTask') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><circle class="sprotty-node sprotty-task-node" r="12" cx="15" cy="15" /><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render boundary error event node', () => {
    const view = viewRegistry.get(EventTypes.BOUNDARY_ERROR);
    const vnode = view.render(graph.index.getById('boundaryError') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" />'
      + '<circle class="sprotty-node sprotty-task-node" r="12" cx="15" cy="15" />'
      + '<svg class="sprotty-node-decorator" height="14" width="14" x="8" y="8" viewBox="0 0 10 10"><path fill="none" d="M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z" /></svg></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render boundary signal event node', () => {
    const view = viewRegistry.get(EventTypes.BOUNDARY_SIGNAL);
    const vnode = view.render(graph.index.getById('boundarySignal') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" />'
      + '<circle class="sprotty-node sprotty-task-node" r="12" cx="15" cy="15" />'
      + '<svg class="sprotty-node-decorator" height="14" width="14" x="8" y="8" viewBox="0 0 10 10"><path fill="none" d="M5,0 L10,10 l-10,0 Z" /></svg></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });
});

describe('GatewayNodeView', () => {
  let context: ModelRenderer;
  let viewRegistry: ViewRegistry;
  let graph: SGraph;

  beforeEach(() => {
    const container = createContainer();
    const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
    context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
    const graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
    viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
    graph = createModel(graphFactory);
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

describe('TaskNodeView', () => {
  let context: ModelRenderer;
  let viewRegistry: ViewRegistry;
  let graph: SGraph;

  beforeEach(() => {
    const container = createContainer();
    const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
    context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
    const graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
    viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
    graph = createModel(graphFactory);
  });

  it('render comment node', () => {
    const view = viewRegistry.get(NodeTypes.COMMENT);
    const vnode = view.render(graph.index.getById('comment') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g></g><g></g><g id="sprotty_commentLabel">'
      + '<foreignObject class="sprotty-label" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="30" width="100" x="0" y="0" z="10" /></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render script node', () => {
    const view = viewRegistry.get(NodeTypes.SCRIPT);
    const vnode = view.render(graph.index.getById('script') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render hd node', () => {
    const view = viewRegistry.get(NodeTypes.HD);
    const vnode = view.render(graph.index.getById('hd') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render user node', () => {
    const view = viewRegistry.get(NodeTypes.USER);
    const vnode = view.render(graph.index.getById('user') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render soap node', () => {
    const view = viewRegistry.get(NodeTypes.SOAP);
    const vnode = view.render(graph.index.getById('soap') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render rest node', () => {
    const view = viewRegistry.get(NodeTypes.REST);
    const vnode = view.render(graph.index.getById('rest') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render db node', () => {
    const view = viewRegistry.get(NodeTypes.DB);
    const vnode = view.render(graph.index.getById('db') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render email node', () => {
    const view = viewRegistry.get(NodeTypes.EMAIL);
    const vnode = view.render(graph.index.getById('email') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render sub process node', () => {
    const view = viewRegistry.get(NodeTypes.SUB_PROCESS);
    const vnode = view.render(graph.index.getById('subProcess') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g></g>'
      + '<svg x="70" y="40"><rect class="sprotty-node sprotty-task-node" width="10" height="10" />'
      + '<line class="sprotty-node-decorator" x1="5" y1="2" x2="5" y2="8" />'
      + '<line class="sprotty-node-decorator" x1="2" y1="5" x2="8" y2="5" /></svg></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render embedded process node', () => {
    const view = viewRegistry.get(NodeTypes.EMBEDDED_PROCESS);
    const vnode = view.render(graph.index.getById('embeddedProcess') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g></g>'
      + '<svg x="70" y="40"><rect class="sprotty-node sprotty-task-node" width="10" height="10" />'
      + '<line class="sprotty-node-decorator" x1="5" y1="2" x2="5" y2="8" />'
      + '<line class="sprotty-node-decorator" x1="2" y1="5" x2="8" y2="5" /></svg></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });
});

describe('LaneNodeView', () => {
  let context: ModelRenderer;
  let viewRegistry: ViewRegistry;
  let graph: SGraph;

  beforeEach(() => {
    const container = createContainer();
    const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
    context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
    const graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
    viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
    graph = createModel(graphFactory);
  });

  it('render pool node', () => {
    const view = viewRegistry.get(LaneTypes.POOL);
    const vnode = view.render(graph.index.getById('pool') as SNode, context);
    const expectation = '<g><rect class="sprotty-node" x="0" y="0" width="800" height="500" />'
      + '<rect class="sprotty-node" x="0" y="0" width="30" height="500" />'
      + '<text id="sprotty_poolLabel" class="sprotty-label label" transform="rotate(270) translate(-250 15)"><tspan /></text></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render lane node', () => {
    const view = viewRegistry.get(LaneTypes.LANE);
    const vnode = view.render(graph.index.getById('lane') as SNode, context);
    const expectation = '<g><rect class="sprotty-node" x="0" y="0" width="770" height="500" /><g></g>'
      + '<text id="sprotty_laneLabel" class="sprotty-label label" transform="rotate(270) translate(-250 15)"><tspan /></text></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });
});

describe('EdgeView', () => {
  let context: ModelRenderer;
  let viewRegistry: ViewRegistry;
  let graph: SGraph;

  beforeEach(() => {
    const container = createContainer();
    const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
    context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
    const graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
    viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
    graph = createModel(graphFactory);
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
