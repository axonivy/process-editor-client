import {
  Bounds,
  createFeatureSet,
  CustomFeatures,
  defaultGLSPModule,
  defaultModule,
  Dimension,
  FeedbackActionDispatcher,
  glspMouseToolModule,
  glspSelectModule,
  LocalModelSource,
  modelSourceModule,
  Point,
  routingModule,
  SGraph,
  SModelFactory,
  SNode,
  TYPES,
  SLabel,
  configureModelElement,
  DefaultTypes,
  SGraphView
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container } from 'inversify';

import { ActivityNode, Edge, EndEventNode, EventNode, GatewayNode, LaneNode, MulitlineEditLabel } from '../../src/diagram/model';
import { ActivityTypes, EdgeTypes, EventEndTypes, EventStartTypes, GatewayTypes, LabelType, LaneTypes } from '../../src/diagram/view-types';
import ivyJumpModule from '../../src/jump/di.config';
import { jumpFeature } from '../../src/jump/model';
import ivyLaneModule from '../../src/lanes/di.config';
import ivyQuickActionModule from '../../src/quick-action/di.config';
import { quickActionFeature } from '../../src/quick-action/model';
import { setupGlobal } from '../test-helper';
import ivyConnectorModule from '../../src/connector/di.config';
import ivyToolBarModule from '../../src/tool-bar/di.config';

export function createContainer(): Container {
  const container = new Container();
  container.load(
    defaultModule,
    defaultGLSPModule,
    modelSourceModule,
    glspSelectModule,
    glspMouseToolModule,
    routingModule,
    ivyQuickActionModule,
    ivyJumpModule,
    ivyLaneModule,
    ivyConnectorModule,
    ivyToolBarModule
  );
  configureModelElement(container, DefaultTypes.GRAPH, SGraph, SGraphView);
  container.bind(TYPES.ModelSource).to(LocalModelSource);
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  return container;
}

export function createRoot(container: Container): SGraph {
  const graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
  const root = graphFactory.createRoot({ id: 'graph', type: 'graph' }) as SGraph;
  root.add(createDefaultNode('foo', ActivityTypes.HD, { x: 100, y: 100, width: 200, height: 50 }, ActivityNode.DEFAULT_FEATURES));
  root.add(
    createDefaultNode('sub', ActivityTypes.EMBEDDED_PROCESS, { x: 300, y: 100, width: 200, height: 50 }, ActivityNode.DEFAULT_FEATURES, {
      enable: [jumpFeature]
    })
  );
  root.add(
    createDefaultNode('alternative', GatewayTypes.ALTERNATIVE, { x: 100, y: 200, width: 32, height: 32 }, GatewayNode.DEFAULT_FEATURES)
  );
  root.add(
    createDefaultNode(
      'alternativeWithConnection',
      GatewayTypes.ALTERNATIVE,
      { x: 100, y: 200, width: 32, height: 32 },
      GatewayNode.DEFAULT_FEATURES
    )
  );
  root.add(createDefaultNode('start', EventStartTypes.START, { x: 200, y: 200, width: 30, height: 30 }, EventNode.DEFAULT_FEATURES));
  root.add(
    createDefaultNode('startWithConnection', EventStartTypes.START, { x: 200, y: 200, width: 30, height: 30 }, EventNode.DEFAULT_FEATURES)
  );
  root.add(createNode(new EndEventNode(), 'end', EventEndTypes.END, { x: 300, y: 200, width: 30, height: 30 }, EventNode.DEFAULT_FEATURES));
  root.add(
    createDefaultNode('noQuickActions', ActivityTypes.HD, { x: 500, y: 500, width: 200, height: 50 }, ActivityNode.DEFAULT_FEATURES, {
      disable: [quickActionFeature]
    })
  );
  root.add(createDefaultNode('comment', ActivityTypes.COMMENT, { x: 600, y: 500, width: 200, height: 50 }, ActivityNode.DEFAULT_FEATURES));
  const edge = createEdge('edge', EdgeTypes.DEFAULT, 'startWithConnection', 'end', Edge.DEFAULT_FEATURES);
  const edge2 = createEdge('edge2', EdgeTypes.DEFAULT, 'alternativeWithConnection', 'end', Edge.DEFAULT_FEATURES);
  root.add(edge);
  root.add(edge2);
  edge.add(createLabel(edge.id));
  root.add(createNode(new LaneNode(), 'pool', LaneTypes.POOL, { x: 0, y: 0, width: 500, height: 100 }, LaneNode.DEFAULT_FEATURES));
  root.add(createNode(new LaneNode(), 'lane', LaneTypes.LANE, { x: 0, y: 100, width: 500, height: 100 }, LaneNode.DEFAULT_FEATURES));
  return root;
}

function createDefaultNode(id: string, type: string, bounds: Bounds, defaultFeatures: symbol[], customFeatues?: CustomFeatures): SNode {
  const node = new SNode();
  return createNode(node, id, type, bounds, defaultFeatures, customFeatues);
}

function createNode(
  node: SNode,
  id: string,
  type: string,
  bounds: Bounds,
  defaultFeatures: symbol[],
  customFeatues?: CustomFeatures
): SNode {
  node.id = id;
  node.type = type;
  node.bounds = bounds;
  node.features = createFeatureSet(defaultFeatures, customFeatues);
  return node;
}

function createEdge(
  id: string,
  type: string,
  sourceId: string,
  targetId: string,
  defaultFeatures: symbol[],
  customFeatues?: CustomFeatures
): Edge {
  const edge = new Edge();
  edge.id = id;
  edge.type = type;
  edge.sourceId = sourceId;
  edge.targetId = targetId;
  edge.features = createFeatureSet(defaultFeatures, customFeatues);
  return edge;
}

function createLabel(id: string): SLabel {
  const label = new MulitlineEditLabel();
  label.text = '';
  label.type = LabelType.DEFAULT;
  label.features = createFeatureSet(MulitlineEditLabel.DEFAULT_FEATURES);
  return label;
}

export function setupSprottyDiv(): void {
  setupGlobal();
  const baseDiv = document.createElement('div') as HTMLElement;
  baseDiv.id = 'sprotty';
  document.body.appendChild(baseDiv);
}

export function getQuickActionDiv(): HTMLElement {
  return document.getElementById('sprotty_quickActionsUi') as HTMLElement;
}

export function assertMultiQuickActionUi(uiDiv: HTMLElement, childCount: number, dimension: Dimension, position?: Point): void {
  assertQuickActionUi(uiDiv, childCount + 1, position);
  const selectionBorder = uiDiv.children[0] as HTMLElement;
  expect(selectionBorder.tagName).to.be.equals('DIV');
  expect(selectionBorder.style.height).to.be.equals(`${dimension.height}px`);
  expect(selectionBorder.style.width).to.be.equals(`${dimension.width}px`);
}

export function assertQuickActionUi(uiDiv: HTMLElement, childCount: number, position?: Point): void {
  expect(uiDiv.style.visibility).to.be.equals('visible');
  expect(uiDiv.children.length).to.be.equals(childCount);
  if (position) {
    expect(uiDiv.style.top).to.be.equals(`${position.y}px`);
    expect(uiDiv.style.left).to.be.equals(`${position.x}px`);
  }
}

export function assertQuickAction(child: Element, title: string, icon?: string, position?: Point): void {
  const quickAction = child as HTMLElement;
  expect(quickAction.tagName).to.be.equals('SPAN');
  expect(quickAction.title).to.be.equals(title);
  if (icon) {
    const iconElement = quickAction.children[0];
    expect(iconElement.className).to.contains(icon);
  }
  if (position) {
    expect(quickAction.style.top).to.be.equals(`${position.y}px`);
    expect(quickAction.style.left).to.be.equals(`${position.x}px`);
  }
}
