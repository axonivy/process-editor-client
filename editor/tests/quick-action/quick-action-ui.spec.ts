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
  SModelRoot,
  SNode,
  TYPES,
  SLabel
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container } from 'inversify';

import { ActivityNode, Edge, EndEventNode, EventNode, GatewayNode, LaneNode, MulitlineEditLabel } from '../../src/diagram/model';
import { ActivityTypes, EdgeTypes, EventEndTypes, EventStartTypes, GatewayTypes, LabelType, LaneTypes } from '../../src/diagram/view-types';
import ivyJumpModule from '../../src/jump/di.config';
import { jumpFeature } from '../../src/jump/model';
import ivyLaneModule from '../../src/lanes/di.config';
import ivyQuickActionModule, { configureQuickActionProviders } from '../../src/quick-action/di.config';
import { quickActionFeature } from '../../src/quick-action/model';
import { QuickActionUI } from '../../src/quick-action/quick-action-ui';
import { setupGlobal } from '../test-helper';
import ivyConnectorModule from '../../src/connector/di.config';

class QuickActionUIReadonly extends QuickActionUI {
  protected isReadonly(): boolean {
    return true;
  }
}

function createContainerReadonly(): Container {
  const container = new Container();
  container.load(defaultModule, defaultGLSPModule, modelSourceModule, glspSelectModule, glspMouseToolModule, routingModule, ivyJumpModule, ivyLaneModule, ivyConnectorModule);
  container.bind(TYPES.ModelSource).to(LocalModelSource);
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  container.bind(QuickActionUIReadonly).toSelf().inSingletonScope();
  container.bind(TYPES.IUIExtension).toService(QuickActionUIReadonly);
  configureQuickActionProviders(container);
  return container;
}

function createContainer(): Container {
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
    ivyConnectorModule
  );
  container.bind(TYPES.ModelSource).to(LocalModelSource);
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  return container;
}

function createRoot(container: Container): SGraph {
  const graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
  const root = graphFactory.createRoot({ id: 'graph', type: 'graph' }) as SGraph;
  root.add(createDefaultNode('foo', ActivityTypes.HD, { x: 100, y: 100, width: 200, height: 50 }, ActivityNode.DEFAULT_FEATURES));
  root.add(createDefaultNode('sub', ActivityTypes.EMBEDDED_PROCESS, { x: 300, y: 100, width: 200, height: 50 }, ActivityNode.DEFAULT_FEATURES, { enable: [jumpFeature] }));
  root.add(createDefaultNode('alternative', GatewayTypes.ALTERNATIVE, { x: 100, y: 200, width: 32, height: 32 }, GatewayNode.DEFAULT_FEATURES));
  root.add(createDefaultNode('start', EventStartTypes.START, { x: 200, y: 200, width: 30, height: 30 }, EventNode.DEFAULT_FEATURES));
  root.add(createNode(new EndEventNode(), 'end', EventEndTypes.END, { x: 300, y: 200, width: 30, height: 30 }, EventNode.DEFAULT_FEATURES));
  root.add(createDefaultNode('noQuickActions', ActivityTypes.HD, { x: 500, y: 500, width: 200, height: 50 }, ActivityNode.DEFAULT_FEATURES, { disable: [quickActionFeature] }));
  const edge = createEdge('edge', EdgeTypes.DEFAULT, 'start', 'end', Edge.DEFAULT_FEATURES);
  root.add(edge);
  edge.add(createLabel(edge.id));
  root.add(createNode(new LaneNode(), 'pool', LaneTypes.POOL, { x: 0, y: 0, width: 500, height: 100 }, LaneNode.DEFAULT_FEATURES));
  root.add(createNode(new LaneNode(), 'lane', LaneTypes.LANE, { x: 0, y: 100, width: 500, height: 100 }, LaneNode.DEFAULT_FEATURES));
  return root;
}

function createDefaultNode(id: string, type: string, bounds: Bounds, defaultFeatures: symbol[], customFeatues?: CustomFeatures): SNode {
  const node = new SNode();
  return createNode(node, id, type, bounds, defaultFeatures, customFeatues);
}

function createNode(node: SNode, id: string, type: string, bounds: Bounds, defaultFeatures: symbol[], customFeatues?: CustomFeatures): SNode {
  node.id = id;
  node.type = type;
  node.bounds = bounds;
  node.features = createFeatureSet(defaultFeatures, customFeatues);
  return node;
}

function createEdge(id: string, type: string, sourceId: string, targetId: string, defaultFeatures: symbol[], customFeatues?: CustomFeatures): Edge {
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

function setupSprottyDiv(): void {
  setupGlobal();
  const baseDiv = document.createElement('div') as HTMLElement;
  baseDiv.id = 'sprotty';
  document.body.appendChild(baseDiv);
}

describe('QuickActionUiReadonly', () => {
  let quickActionUi: QuickActionUI;
  let root: SModelRoot;

  before(() => {
    setupSprottyDiv();
    const container = createContainerReadonly();
    quickActionUi = container.get<QuickActionUI>(QuickActionUIReadonly);
    root = createRoot(container);
  });

  it('ui is rendered for activity element', () => {
    quickActionUi.show(root, 'foo');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 0, { x: 100, y: 100 });
  });

  it('ui is rendered for activity embedded element', () => {
    quickActionUi.show(root, 'sub');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 1, { x: 300, y: 100 });
    assertQuickAction(uiDiv.children[0], 'Jump (J)', 'fa-solid fa-turn-down', { x: -30, y: 60 });
  });
});

describe('QuickActionUi', () => {
  let quickActionUi: QuickActionUI;
  let root: SModelRoot;

  before(() => {
    setupSprottyDiv();
    const container = createContainer();
    quickActionUi = container.get<QuickActionUI>(QuickActionUI);
    root = createRoot(container);
  });

  it('ui is not rendered by default', () => {
    const uiDiv = getQuickActionDiv();
    expect(uiDiv).to.be.null;
  });

  it('ui is not rendered for node with disabled feature', () => {
    quickActionUi.show(root, 'noQuickActions');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 0);
  });

  it('ui is rendered for edges', () => {
    quickActionUi.setCursorPosition({ x: 50, y: 50 });
    quickActionUi.show(root, 'edge');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 4);
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Edit Label (L)', 'fa-solid fa-tag', { x: 2, y: -30 });
    assertQuickAction(uiDiv.children[2], 'Straighten (S)', 'fa-solid fa-arrows-left-right', { x: -30, y: 10 });
    assertQuickAction(uiDiv.children[3], 'Bend (B)', 'fa-solid fa-ruler-combined', { x: 2, y: 10 });
  });

  it('ui is rendered for activity element', () => {
    quickActionUi.show(root, 'foo');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 2, { x: 100, y: 100 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Connect', 'fa-solid fa-arrow-right-long', { x: 210, y: 0 });
  });

  it('ui is rendered for activity embedded element', () => {
    quickActionUi.show(root, 'sub');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 3, { x: 300, y: 100 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Connect', 'fa-solid fa-arrow-right-long', { x: 210, y: 0 });
    assertQuickAction(uiDiv.children[2], 'Jump (J)', 'fa-solid fa-turn-down', { x: -30, y: 60 });
  });

  it('ui is rendered for event element', () => {
    quickActionUi.show(root, 'start');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 2, { x: 200, y: 200 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Connect', 'fa-solid fa-arrow-right-long', { x: 40, y: 0 });

    quickActionUi.show(root, 'end');
    assertQuickActionUi(uiDiv, 1, { x: 300, y: 200 });
  });

  it('ui is rendered for gateway element', () => {
    quickActionUi.show(root, 'alternative');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 2, { x: 100, y: 200 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Connect', 'fa-solid fa-arrow-right-long', { x: 42, y: 0 });
  });

  it('ui is rendered for pool', () => {
    quickActionUi.show(root, 'pool');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 2, { x: 0, y: 0 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: 3, y: 3 });
    assertQuickAction(uiDiv.children[1], 'Create Lane', 'fa-solid fa-table-columns fa-rotate-270', { x: 3, y: 73 });
  });

  it('ui is rendered for lane', () => {
    quickActionUi.show(root, 'lane');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 1, { x: 0, y: 100 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: 3, y: 3 });
  });

  it('multi selection ui is rendered', () => {
    quickActionUi.show(root, 'start', 'end');
    const uiDiv = getQuickActionDiv();
    assertMultiQuickActionUi(uiDiv, 2, { height: 40, width: 140 }, { x: 200, y: 200 });
    assertQuickAction(uiDiv.children[1], 'Delete', 'fa-solid fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[2], 'Auto Align (A)', 'fa-solid fa-up-down-left-right', { x: -30, y: 40 });

    quickActionUi.show(root, 'start', 'end', 'foo');
    assertMultiQuickActionUi(uiDiv, 2, { height: 140, width: 240 }, { x: 100, y: 100 });
  });
});

function getQuickActionDiv(): HTMLElement {
  return document.getElementById('sprotty_quickActionsUi') as HTMLElement;
}

function assertMultiQuickActionUi(uiDiv: HTMLElement, childCount: number, dimension: Dimension, position?: Point): void {
  assertQuickActionUi(uiDiv, childCount + 1, position);
  const selectionBorder = uiDiv.children[0] as HTMLElement;
  expect(selectionBorder.tagName).to.be.equals('DIV');
  expect(selectionBorder.style.height).to.be.equals(`${dimension.height}px`);
  expect(selectionBorder.style.width).to.be.equals(`${dimension.width}px`);
}

function assertQuickActionUi(uiDiv: HTMLElement, childCount: number, position?: Point): void {
  expect(uiDiv.style.visibility).to.be.equals('visible');
  expect(uiDiv.children.length).to.be.equals(childCount);
  if (position) {
    expect(uiDiv.style.top).to.be.equals(`${position.y}px`);
    expect(uiDiv.style.left).to.be.equals(`${position.x}px`);
  }
}

function assertQuickAction(child: Element, title: string, icon: string, position: Point): void {
  const quickAction = child as HTMLElement;
  expect(quickAction.tagName).to.be.equals('I');
  expect(quickAction.className).to.contains(icon);
  expect(quickAction.title).to.be.equals(title);
  expect(quickAction.style.top).to.be.equals(`${position.y}px`);
  expect(quickAction.style.left).to.be.equals(`${position.x}px`);
}
