import {
  configureView,
  createFeatureSet,
  defaultModule,
  DefaultTypes,
  graphModule,
  IVNodePostprocessor,
  ModelRenderer,
  ModelRendererFactory,
  moveModule,
  routingModule,
  selectFeature,
  selectModule,
  SGraph,
  SModelFactory,
  TYPES,
  ViewRegistry
} from '@eclipse-glsp/client';
import baseViewModule from '@eclipse-glsp/client/lib/views/base-view-module';
import { expect } from 'chai';
import { Container } from 'inversify';
import { describe } from 'mocha';

import { smartActionFeature, SmartActionHandleLocation, SSmartActionHandle } from './model';
import { SSmartActionHandleView } from './view';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule, baseViewModule, selectModule, moveModule, graphModule, routingModule);
  configureView(container, SSmartActionHandle.TYPE, SSmartActionHandleView);
  return container;
}

function createModel(graphFactory: SModelFactory): SGraph {
  const node = {
    id: 'node', type: DefaultTypes.NODE, position: { x: 100, y: 100 }, size: { width: 200, height: 50 },
    features: createFeatureSet([selectFeature, smartActionFeature]),
    children: [{ id: 'smartActionHandle', type: SSmartActionHandle.TYPE, location: SmartActionHandleLocation.TopLeft }]
  };
  const graph = graphFactory.createRoot({ id: 'graph', type: 'graph', children: [node] }) as SGraph;
  return graph;
}

describe('GeneralView', () => {
  let context: ModelRenderer;
  let graphFactory: SModelFactory;
  let viewRegistry: ViewRegistry;
  let graph: SGraph;

  beforeEach(() => {
    const container = createContainer();
    const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
    context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
    graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
    viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
    graph = createModel(graphFactory);
  });

  it('render smart action handle', () => {
    const view = viewRegistry.get(SSmartActionHandle.TYPE);
    const vnode = view.render(graph.index.getById('smartActionHandle') as SSmartActionHandle, context);
    const expectation = '<g data-kind="top-left"><circle class="ivy-smart-action-handle" cx="10" cy="-20" r="14" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="16" x="3" y="-27" /></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render full graph', () => {
    const vnode = context.renderElement(graph);
    const expectation = '<svg id="sprotty_graph" class="sprotty-graph" tabindex="0">'
      + '<g transform="scale(1) translate(0,0)"><g id="sprotty_node" transform="translate(100, 100)">'
      + '<rect class="sprotty-node" x="0" y="0" width="200" height="50" />'
      + '<g id="sprotty_smartActionHandle" data-kind="top-left"><circle class="ivy-smart-action-handle" cx="10" cy="-20" r="14" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="16" x="3" y="-27" /></g></g></g></g></svg>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

});
