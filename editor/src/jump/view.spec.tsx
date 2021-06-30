import {
  configureView,
  defaultModule,
  graphModule,
  IVNodePostprocessor,
  ModelRenderer,
  ModelRendererFactory,
  moveModule,
  routingModule,
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

import { SJumpOutHandle } from './model';
import { SJumpOutHandleView } from './view';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule, baseViewModule, selectModule, moveModule, graphModule, routingModule);
  configureView(container, SJumpOutHandle.TYPE, SJumpOutHandleView);
  return container;
}

function createModel(graphFactory: SModelFactory): SGraph {
  const jump = { id: 'jump', type: SJumpOutHandle.TYPE };
  const graph = graphFactory.createRoot({ id: 'graph', type: 'graph', children: [jump] }) as SGraph;
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

  it('render jump out handle', () => {
    const view = viewRegistry.get(SJumpOutHandle.TYPE);
    const vnode = view.render(graph.index.getById('jump') as SJumpOutHandle, context);
    const expectation = '<g class="jump-out-handle"><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="16" x="8" y="8" /></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render full graph', () => {
    const vnode = context.renderElement(graph);
    const expectation = '<svg id="sprotty_graph" class="sprotty-graph" tabindex="0">'
      + '<g transform="scale(1) translate(0,0)"><g id="sprotty_jump" class="jump-out-handle"><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="16" x="8" y="8" /></g></g></g></svg>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

});
