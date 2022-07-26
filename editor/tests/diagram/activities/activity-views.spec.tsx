import 'reflect-metadata';

import { ModelRenderer, SGraph, SModelFactory, SNode, ViewRegistry } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { VNode } from 'snabbdom';

import { ActivityTypes, LabelType } from '../../../src/diagram/view-types';
import { setupGlobal, setupViewTestContainer } from '../../test-helper';
import { ActivityNode } from '../../../src/diagram/model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

function createModel(graphFactory: SModelFactory): SGraph {
  const children: any[] = [];
  const taskNodeSize = { width: 150, height: 50 };
  children.push({
    id: 'comment',
    type: ActivityTypes.COMMENT,
    position: { x: 600, y: 100 },
    size: taskNodeSize,
    children: [{ id: 'commentLabel', type: LabelType.DEFAULT, text: 'comment', position: { x: 0, y: 0 }, size: { width: 100, height: 30 } }]
  });
  children.push({ id: 'script', type: ActivityTypes.SCRIPT, position: { x: 600, y: 150 }, size: taskNodeSize, args: { iconUri: 'std:Step' } });
  children.push({ id: 'hd', type: ActivityTypes.HD, position: { x: 600, y: 200 }, size: taskNodeSize, args: { iconUri: 'std:UserDialog' } });
  children.push({ id: 'user', type: ActivityTypes.USER, position: { x: 600, y: 250 }, size: taskNodeSize, args: { iconUri: 'std:User' } });
  children.push({ id: 'soap', type: ActivityTypes.SOAP, position: { x: 600, y: 300 }, size: taskNodeSize, args: { iconUri: 'std:WebService' } });
  children.push({ id: 'rest', type: ActivityTypes.REST, position: { x: 600, y: 350 }, size: taskNodeSize, args: { iconUri: 'std:RestClient' } });
  children.push({ id: 'db', type: ActivityTypes.DB, position: { x: 600, y: 400 }, size: taskNodeSize, args: { iconUri: 'std:Database' } });
  children.push({ id: 'email', type: ActivityTypes.EMAIL, position: { x: 600, y: 450 }, size: taskNodeSize, args: { iconUri: 'std:Mail' } });
  children.push({ id: 'subProcess', type: ActivityTypes.SUB_PROCESS, position: { x: 600, y: 500 }, size: taskNodeSize, args: { iconUri: 'std:NoDecorator' } });
  children.push({ id: 'embeddedProcess', type: ActivityTypes.EMBEDDED_PROCESS, position: { x: 600, y: 550 }, size: taskNodeSize, args: { iconUri: 'std:NoDecorator' } });
  children.push({ id: 'webPage', type: ActivityTypes.WEB_PAGE, position: { x: 600, y: 600 }, size: taskNodeSize, args: { iconUri: 'std:Page' } });
  children.push({ id: 'trigger', type: ActivityTypes.TRIGGER, position: { x: 600, y: 650 }, size: taskNodeSize, args: { iconUri: 'std:Trigger' } });
  children.push({ id: 'program', type: ActivityTypes.PROGRAM, position: { x: 600, y: 700 }, size: taskNodeSize, args: { iconUri: 'std:Program' } });
  children.push({ id: 'thirdParty', type: ActivityTypes.THIRD_PARTY, position: { x: 600, y: 750 }, size: taskNodeSize, args: { iconUri: 'std:Rule' } });
  return graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as SGraph;
}

describe('ActivityNodeView', () => {
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

  it('render full activity graph', () => {
    const graphVNode = context.renderElement(graph);
    expect(toHTML(graphVNode)).to.not.include('sprotty_unknown').and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    const unknownVNode = context.renderElement(unknown);
    expect(toHTML(unknownVNode)).to.be.equal('<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0">?unknown?</text>');
  });

  it('render comment node', () => {
    assertNode(ActivityTypes.COMMENT, 'comment', { label: true });
  });

  it('render script node', () => {
    assertNode(ActivityTypes.SCRIPT, 'script', { icon: true });
  });

  it('render hd node', () => {
    assertNode(ActivityTypes.HD, 'hd', { icon: true });
  });

  it('render user node', () => {
    assertNode(ActivityTypes.USER, 'user', { icon: true });
  });

  it('render soap node', () => {
    assertNode(ActivityTypes.SOAP, 'soap', { icon: true });
  });

  it('render rest node', () => {
    assertNode(ActivityTypes.REST, 'rest', { icon: true });
  });

  it('render db node', () => {
    assertNode(ActivityTypes.DB, 'db', { icon: true });
  });

  it('render email node', () => {
    assertNode(ActivityTypes.EMAIL, 'email', { icon: true });
  });

  it('render sub process node', () => {
    assertNode(ActivityTypes.SUB_PROCESS, 'subProcess', { decorator: true });
  });

  it('render embedded process node', () => {
    assertNode(ActivityTypes.EMBEDDED_PROCESS, 'embeddedProcess', { decorator: true });
  });

  it('render web page node', () => {
    assertNode(ActivityTypes.WEB_PAGE, 'webPage', { icon: true });
  });

  it('render trigger node', () => {
    assertNode(ActivityTypes.TRIGGER, 'trigger', { icon: true });
  });

  it('render program node', () => {
    assertNode(ActivityTypes.PROGRAM, 'program', { icon: true });
  });

  it('render third party node', () => {
    assertNode(ActivityTypes.THIRD_PARTY, 'thirdParty', { icon: true });
  });

  it('render activity with execution badge', () => {
    const view = viewRegistry.get(ActivityTypes.SCRIPT);
    const script = graph.index.getById('script') as ActivityNode;
    script.executionCount = 3;
    const vnode = view.render(script, context);
    const executionBadge = '<g><rect class="execution-badge" rx="6" ry="6" x="139" y="-6" width="22" height="12" /><text class="execution-text" x="150" dy=".3em">3</text></g>';
    expect(toHTML(vnode)).to.contains(executionBadge);
  });

  it('render activity with color dot', () => {
    const view = viewRegistry.get(ActivityTypes.SCRIPT);
    const script = graph.index.getById('script') as ActivityNode;
    script.args.color = 'red';
    const vnode = view.render(script, context);
    const colorDot = '<circle r="6" cx="141" cy="9" style="fill: red" />';
    expect(toHTML(vnode)).to.contain(colorDot);
  });

  function renderNode(type: string, nodeId: string): VNode | undefined {
    const view = viewRegistry.get(type);
    return view.render(graph.index.getById(nodeId) as SNode, context);
  }

  function assertNode(type: string, nodeId: string, options: { label?: boolean; icon?: boolean; decorator?: boolean }): void {
    const node = toHTML(renderNode(type, nodeId));
    expect(node).to.contain('class="sprotty-node');
    if (options.label) {
      expect(node).to.contain('class="sprotty-label node-child-label"');
    } else {
      expect(node).to.not.contain('class="sprotty-label node-child-label"');
    }
    if (options.icon) {
      expect(node).to.contain('class="sprotty-icon"');
    } else {
      expect(node).to.not.contain('class="sprotty-icon"');
    }
    if (options.decorator) {
      const decorator =
        '<svg x="69" y="37" height="12" width="12"><rect class="sprotty-node sprotty-task-node" x="1" y="1" rx="2" ry="2" width="10" height="10" />' +
        '<line class="sprotty-node-decorator" x1="6" y1="3" x2="6" y2="9" />' +
        '<line class="sprotty-node-decorator" x1="3" y1="6" x2="9" y2="6" /></svg>';
      expect(node).to.contain(decorator);
    } else {
      expect(node).to.not.contain('sprotty-node-decorator');
    }
  }
});
