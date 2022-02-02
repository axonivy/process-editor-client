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
  SNode,
  TYPES,
  ViewRegistry
} from '@eclipse-glsp/client';
import baseViewModule from '@eclipse-glsp/client/lib/views/base-view-module';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { expect } from 'chai';
import { Container } from 'inversify';

import { SBreakpointHandle } from '../../src/breakpoint/model';
import { SBreakpointHandleView } from '../../src/breakpoint/view';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule, baseViewModule, selectModule, moveModule, graphModule, routingModule);
  configureView(container, SBreakpointHandle.TYPE, SBreakpointHandleView);
  return container;
}

function createModel(graphFactory: SModelFactory): SGraph {
  const node = {
    id: 'node',
    type: DefaultTypes.NODE,
    position: { x: 100, y: 100 },
    size: { width: 200, height: 50 },
    children: [{ id: 'breakpoint', type: SBreakpointHandle.TYPE }]
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

  it('render breakpoint', () => {
    const view = viewRegistry.get(SBreakpointHandle.TYPE);
    const vnode = view.render(graph.index.getById('breakpoint') as SNode, context);
    const expectation = '<g><circle class="ivy-breakpoint-handle" cx="-7" cy="0" r="7" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render full graph', () => {
    const vnode = context.renderElement(graph);
    const expectation =
      '<svg id="sprotty_graph" class="sprotty-graph" tabindex="0"><g transform="scale(1) translate(0,0)">' +
      '<g id="sprotty_node" transform="translate(100, 100)"><rect class="sprotty-node" x="0" y="0" width="200" height="50" />' +
      '<g id="sprotty_breakpoint"><circle class="ivy-breakpoint-handle" cx="-7" cy="0" r="7" /></g></g></g></svg>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });
});
