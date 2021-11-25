import 'reflect-metadata';

import { ModelRenderer, SGraph, SModelFactory, SNode, ViewRegistry } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { ActivityTypes, LabelType } from '../../../src/diagram/view-types';
import { setupGlobal, setupViewTestContainer } from '../../test-helper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

function createModel(graphFactory: SModelFactory): SGraph {
  const children: any[] = [];
  const taskNodeSize = { width: 150, height: 50 };
  children.push({
    id: 'comment', type: ActivityTypes.COMMENT, position: { x: 600, y: 100 }, size: taskNodeSize,
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
  children.push({ id: 'program', type: ActivityTypes.PROGRAMM, position: { x: 600, y: 700 }, size: taskNodeSize, args: { iconUri: 'std:Program' } });
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
    expect(toHTML(graphVNode)).to.not.include('sprotty_unknown')
      .and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    const unknownVNode = context.renderElement(unknown);
    expect(toHTML(unknownVNode)).to.be.equal('<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0">?unknown?</text>');
  });

  it('render comment node', () => {
    const view = viewRegistry.get(ActivityTypes.COMMENT);
    const vnode = view.render(graph.index.getById('comment') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g></g><g></g><g id="sprotty_commentLabel">'
      + '<foreignObject class="sprotty-label node-child-label" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="30" width="100" x="0" y="0" z="10" />'
      + '</g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render script node', () => {
    const view = viewRegistry.get(ActivityTypes.SCRIPT);
    const vnode = view.render(graph.index.getById('script') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render hd node', () => {
    const view = viewRegistry.get(ActivityTypes.HD);
    const vnode = view.render(graph.index.getById('hd') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render user node', () => {
    const view = viewRegistry.get(ActivityTypes.USER);
    const vnode = view.render(graph.index.getById('user') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render soap node', () => {
    const view = viewRegistry.get(ActivityTypes.SOAP);
    const vnode = view.render(graph.index.getById('soap') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render rest node', () => {
    const view = viewRegistry.get(ActivityTypes.REST);
    const vnode = view.render(graph.index.getById('rest') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render db node', () => {
    const view = viewRegistry.get(ActivityTypes.DB);
    const vnode = view.render(graph.index.getById('db') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render email node', () => {
    const view = viewRegistry.get(ActivityTypes.EMAIL);
    const vnode = view.render(graph.index.getById('email') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render sub process node', () => {
    const view = viewRegistry.get(ActivityTypes.SUB_PROCESS);
    const vnode = view.render(graph.index.getById('subProcess') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g></g>'
      + '<svg x="70" y="40"><rect class="sprotty-node sprotty-task-node" width="10" height="10" />'
      + '<line class="sprotty-node-decorator" x1="5" y1="2" x2="5" y2="8" />'
      + '<line class="sprotty-node-decorator" x1="2" y1="5" x2="8" y2="5" /></svg></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render embedded process node', () => {
    const view = viewRegistry.get(ActivityTypes.EMBEDDED_PROCESS);
    const vnode = view.render(graph.index.getById('embeddedProcess') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g></g>'
      + '<svg x="70" y="40"><rect class="sprotty-node sprotty-task-node" width="10" height="10" />'
      + '<line class="sprotty-node-decorator" x1="5" y1="2" x2="5" y2="8" />'
      + '<line class="sprotty-node-decorator" x1="2" y1="5" x2="8" y2="5" /></svg></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render web page node', () => {
    const view = viewRegistry.get(ActivityTypes.WEB_PAGE);
    const vnode = view.render(graph.index.getById('webPage') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render trigger node', () => {
    const view = viewRegistry.get(ActivityTypes.TRIGGER);
    const vnode = view.render(graph.index.getById('trigger') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render program node', () => {
    const view = viewRegistry.get(ActivityTypes.PROGRAMM);
    const vnode = view.render(graph.index.getById('program') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render third party node', () => {
    const view = viewRegistry.get(ActivityTypes.WEB_PAGE);
    const vnode = view.render(graph.index.getById('thirdParty') as SNode, context);
    const expectation = '<g><rect class="sprotty-node task" x="0" y="0" rx="5" ry="5" width="150" height="50" /><g>'
      + '<foreignObject class="sprotty-icon" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="16" width="20" x="2" y="2" /></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });
});
