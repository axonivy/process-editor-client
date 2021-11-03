import {
  ActionDispatcher,
  Bounds,
  createFeatureSet,
  CustomFeatures,
  defaultGLSPModule,
  defaultModule,
  Dimension,
  EMPTY_BOUNDS,
  FeedbackActionDispatcher,
  GLSP_TYPES,
  glspMouseToolModule,
  glspSelectModule,
  InitializeCanvasBoundsAction,
  LocalModelSource,
  modelSourceModule,
  Point,
  routingModule,
  SEdge,
  SGraph,
  SModelFactory,
  SModelRoot,
  SNode,
  TYPES
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container } from 'inversify';
import { before, describe, it } from 'mocha';

import { ActivityNode, EndEventNode, EventNode, GatewayNode, LaneNode } from '../diagram/model';
import { ActivityTypes, EdgeTypes, EventTypes, GatewayTypes, LaneTypes } from '../diagram/view-types';
import ivyJumpModule from '../jump/di.config';
import { jumpFeature } from '../jump/model';
import ivyLaneModule from '../lanes/di.config';
import ivyQuickActionModule from './di.config';
import { quickActionFeature } from './model';
import { QuickActionUI } from './quick-action-ui';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule, defaultGLSPModule, modelSourceModule, glspSelectModule, glspMouseToolModule, routingModule,
    ivyQuickActionModule, ivyJumpModule, ivyLaneModule);
  container.bind(TYPES.ModelSource).to(LocalModelSource);
  container.bind(GLSP_TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  return container;
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
function createEdge(id: string, type: string, sourceId: string, targetId: string): SEdge {
  const edge = new SEdge();
  edge.id = id;
  edge.type = type;
  edge.sourceId = sourceId;
  edge.targetId = targetId;
  return edge;
}

function createRoot(graphFactory: SModelFactory): SGraph {
  const root = graphFactory.createRoot({ id: 'graph', type: 'graph' }) as SGraph;
  root.add(createDefaultNode('foo', ActivityTypes.HD, { x: 100, y: 100, width: 200, height: 50 },
    ActivityNode.DEFAULT_FEATURES));
  root.add(createDefaultNode('sub', ActivityTypes.EMBEDDED_PROCESS, { x: 300, y: 100, width: 200, height: 50 },
    ActivityNode.DEFAULT_FEATURES, { enable: [jumpFeature] }));
  root.add(createDefaultNode('alternative', GatewayTypes.ALTERNATIVE, { x: 100, y: 200, width: 32, height: 32 },
    GatewayNode.DEFAULT_FEATURES));
  root.add(createDefaultNode('start', EventTypes.START, { x: 200, y: 200, width: 30, height: 30 },
    EventNode.DEFAULT_FEATURES));
  root.add(createNode(new EndEventNode(), 'end', EventTypes.END, { x: 300, y: 200, width: 30, height: 30 },
    EventNode.DEFAULT_FEATURES));
  root.add(createDefaultNode('noQuickActions', ActivityTypes.HD, { x: 500, y: 500, width: 200, height: 50 },
    ActivityNode.DEFAULT_FEATURES, { disable: [quickActionFeature] }));
  root.add(createEdge('edge', EdgeTypes.DEFAULT, 'start', 'end'));
  root.add(createNode(new LaneNode(), 'pool', LaneTypes.POOL, { x: 0, y: 0, width: 500, height: 100 },
    LaneNode.DEFAULT_FEATURES));
  root.add(createNode(new LaneNode(), 'lane', LaneTypes.LANE, { x: 0, y: 100, width: 500, height: 100 },
    LaneNode.DEFAULT_FEATURES));
  return root;
}

describe('QuickActionUi', () => {
  let quickActionUi: QuickActionUI;
  let root: SModelRoot;

  before(() => {
    const container = createContainer();
    const actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(new InitializeCanvasBoundsAction(EMPTY_BOUNDS));
    quickActionUi = container.get<QuickActionUI>(QuickActionUI);
    const graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
    root = createRoot(graphFactory);
    const baseDiv = document.createElement('div') as HTMLElement;
    baseDiv.id = 'sprotty';
    document.body.appendChild(baseDiv);
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

  it('ui is not rendered for edges', () => {
    quickActionUi.show(root, 'edge');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 0);
  });

  it('ui is rendered for activity element', () => {
    quickActionUi.show(root, 'foo');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 3, { x: 100, y: 100 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Edit', 'fa-pen', { x: 2, y: -30 });
    assertQuickAction(uiDiv.children[2], 'Connect', 'fa-long-arrow-alt-right', { x: 210, y: -30 });
  });

  it('ui is rendered for activity embedded element', () => {
    quickActionUi.show(root, 'sub');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 4, { x: 300, y: 100 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Edit', 'fa-pen', { x: 2, y: -30 });
    assertQuickAction(uiDiv.children[2], 'Connect', 'fa-long-arrow-alt-right', { x: 210, y: -30 });
    assertQuickAction(uiDiv.children[3], 'Jump', 'fa-level-down-alt', { x: -30, y: 60 });
  });

  it('ui is rendered for event element', () => {
    quickActionUi.show(root, 'start');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 3, { x: 200, y: 200 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Edit', 'fa-pen', { x: 2, y: -30 });
    assertQuickAction(uiDiv.children[2], 'Connect', 'fa-long-arrow-alt-right', { x: 40, y: -30 });

    quickActionUi.show(root, 'end');
    assertQuickActionUi(uiDiv, 2, { x: 300, y: 200 });
  });

  it('ui is rendered for gateway element', () => {
    quickActionUi.show(root, 'alternative');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 3, { x: 100, y: 200 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Edit', 'fa-pen', { x: 2, y: -30 });
    assertQuickAction(uiDiv.children[2], 'Connect', 'fa-long-arrow-alt-right', { x: 42, y: -30 });
  });

  it('ui is rendered for pool', () => {
    quickActionUi.show(root, 'pool');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 3, { x: 0, y: 0 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-trash', { x: 3, y: 3 });
    assertQuickAction(uiDiv.children[1], 'Edit', 'fa-pen', { x: 35, y: 3 });
    assertQuickAction(uiDiv.children[2], 'Create Lane', 'fa-columns fa-rotate-270', { x: 3, y: 73 });
  });

  it('ui is rendered for lane', () => {
    quickActionUi.show(root, 'lane');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 2, { x: 0, y: 100 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-trash', { x: 3, y: 3 });
    assertQuickAction(uiDiv.children[1], 'Edit', 'fa-pen', { x: 35, y: 3 });
  });

  it('multi selection ui is rendered', () => {
    quickActionUi.show(root, 'start', 'end');
    const uiDiv = getQuickActionDiv();
    assertMultiQuickActionUi(uiDiv, 2, { height: 40, width: 140 }, { x: 200, y: 200 });
    assertQuickAction(uiDiv.children[1], 'Delete', 'fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[2], 'Auto Align', 'fa-arrows-alt', { x: -30, y: 40 });

    quickActionUi.show(root, 'start', 'end', 'foo');
    assertMultiQuickActionUi(uiDiv, 2, { height: 140, width: 240 }, { x: 100, y: 100 });
  });

  function getQuickActionDiv(): HTMLElement {
    return document.getElementById('sprotty_quickActionsUi') as HTMLElement;
  }
});

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

