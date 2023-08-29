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
import { VNode } from 'snabbdom';

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
    children: [
      { id: 'breakpoint', condition: 'true', type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-disabled', disabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-condition', condition: 'bla', type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-condition-disabled', condition: 'bla', disabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-globaldisabled', globalDisabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-disabled-globaldisabled', disabled: true, globalDisabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-condition-globaldisabled', condition: 'bla', globalDisabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-condition-disabled-globaldisabled', condition: 'bla', disabled: true, globalDisabled: true, type: SBreakpointHandle.TYPE }
    ]
  };
  const graph = graphFactory.createRoot({ id: 'graph', type: 'graph', children: [node] }) as SGraph;
  return graph;
}

describe('BreakpointView', () => {
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
    const vnode = renderBreakpoint('breakpoint');
    const expectation = '<g><circle class="ivy-breakpoint-handle" cx="-10" cy="9" r="4" /></g>';
    expect(toHTML(vnode)).to.be.equals(expectation);
  });

  it('render disabled breakpoint', () => {
    assertBreakpoint('breakpoint-disabled', 'disabled');
  });

  it('render condition breakpoint', () => {
    assertBreakpoint('breakpoint-condition', 'condition');
  });

  it('render condition disabled breakpoint', () => {
    assertBreakpoint('breakpoint-condition-disabled', 'disabled condition');
  });

  it('render (globalDisabled) breakpoint', () => {
    assertBreakpointGlobalDisable('breakpoint-globaldisabled');
  });

  it('render disabled (globalDisabled) breakpoint', () => {
    assertBreakpointGlobalDisable('breakpoint-disabled-globaldisabled', 'disabled');
  });

  it('render condition (globalDisabled) breakpoint', () => {
    assertBreakpointGlobalDisable('breakpoint-condition-globaldisabled', 'condition');
  });

  it('render condition disabled (globalDisabled) breakpoint', () => {
    assertBreakpointGlobalDisable('breakpoint-condition-disabled-globaldisabled', 'disabled condition');
  });

  it('render full graph', () => {
    const vnode = context.renderElement(graph);
    const graphAndNode =
      '<svg id="sprotty_graph" class="sprotty-graph" tabindex="0"><g transform="scale(1) translate(0,0)">' +
      '<g id="sprotty_node" transform="translate(100, 100)"><rect class="sprotty-node" x="0" y="0" width="200" height="50" />';
    expect(toHTML(vnode))
      .to.contains(graphAndNode)
      .and.contains('<g id="sprotty_breakpoint">')
      .and.contains('<g id="sprotty_breakpoint-disabled">')
      .and.contains('<g id="sprotty_breakpoint-condition">')
      .and.contains('<g id="sprotty_breakpoint-condition-disabled">')
      .and.contains('<g id="sprotty_breakpoint-globaldisabled">')
      .and.contains('<g id="sprotty_breakpoint-disabled-globaldisabled">')
      .and.contains('<g id="sprotty_breakpoint-condition-globaldisabled">')
      .and.contains('<g id="sprotty_breakpoint-condition-disabled-globaldisabled">');
  });

  function renderBreakpoint(breakpointId: string): VNode | undefined {
    const view = viewRegistry.get(SBreakpointHandle.TYPE);
    return view.render(graph.index.getById(breakpointId) as SNode, context);
  }

  function assertBreakpoint(breakpointId: string, expectedCssClass: string): void {
    const vnode = renderBreakpoint(breakpointId);
    const breakpoint = `class="ivy-breakpoint-handle ${expectedCssClass}"`;
    expect(toHTML(vnode)).to.contain(breakpoint);
  }

  function assertBreakpointGlobalDisable(breakpointId: string, expectedCssClass?: string): void {
    const vnode = renderBreakpoint(breakpointId);
    let breakpoint = 'class="ivy-breakpoint-handle';
    if (expectedCssClass) {
      breakpoint = `class="ivy-breakpoint-handle ${expectedCssClass}"`;
    }
    const line = '<line class="ivy-breakpoint-handle-globaldisable" x1="-15" y1="14" x2="-5" y2="4" />';
    expect(toHTML(vnode)).to.contain(breakpoint);
    expect(toHTML(vnode)).to.contain(line);
  }
});
