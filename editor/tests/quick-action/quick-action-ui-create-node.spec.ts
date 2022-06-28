import { SModelRoot, TYPES, PaletteItem } from '@eclipse-glsp/client';
import { Container } from 'inversify';

import { QuickActionUI } from '../../src/quick-action/quick-action-ui';
import ivyToolBarModule, { configureToolBarButtonProvider } from '../../src/tool-bar/di.config';
import { ToolBar } from '../../src/tool-bar/tool-bar';
import { IVY_TYPES } from '../../src/types';
import { assertQuickAction, assertQuickActionUi, createContainer, createRoot, getQuickActionDiv, setupSprottyDiv } from './quick-action-ui.spec';

class ToolBarMock extends ToolBar {
  public getElementPaletteItems(): PaletteItem[] | undefined {
    return [
      { id: 'event-group', icon: 'event-group', label: 'Events', sortString: 'A', actions: [] },
      { id: 'gateway-group', icon: 'gateway-group', label: 'Gateways', sortString: 'B', actions: [] },
      { id: 'activity-group', icon: 'activity-group', label: 'Activities', sortString: 'C', actions: [] },
      { id: 'bpmn-activity-group', icon: 'bpmn-activity-group', label: 'BPMN Activities', sortString: 'D', actions: [] },
      { id: 'swimlane-group', icon: 'swimlane-group', label: 'Swimlanes', sortString: 'X', actions: [] },
      { id: 'unknown-group', icon: 'unknown-group', label: 'Unknown', sortString: 'Y', actions: [] }
    ];
  }
}

function createNodeContainer(): Container {
  const container = createContainer();
  container.unload(ivyToolBarModule);
  container.bind(ToolBarMock).toSelf().inSingletonScope();
  container.bind(TYPES.IUIExtension).toService(ToolBarMock);
  container.bind(IVY_TYPES.ToolBar).toService(ToolBarMock);
  configureToolBarButtonProvider(container);
  return container;
}

describe('QuickActionUi - Create Nodes', () => {
  let quickActionUi: QuickActionUI;
  let root: SModelRoot;

  before(() => {
    setupSprottyDiv();
    const container = createNodeContainer();
    quickActionUi = container.get<QuickActionUI>(QuickActionUI);
    root = createRoot(container);
  });

  it('create nodes quick actions are rendered for activity element', () => {
    quickActionUi.show(root, 'foo');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 7, { x: 100, y: 100 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Events (A)', 'fa-regular fa-circle', { x: 210, y: 0 });
    assertQuickAction(uiDiv.children[2], 'Gateways (A)', 'fa-regular fa-square fa-rotate-45', { x: 242, y: 0 });
    assertQuickAction(uiDiv.children[3], 'Activities (A)', 'fa-regular fa-square', { x: 274, y: 0 });
    assertQuickAction(uiDiv.children[4], 'BPMN Activities (A)', 'fa-solid fa-diagram-next', { x: 210, y: 32 });
    assertQuickAction(uiDiv.children[5], 'Attach Comment', 'fa-regular fa-message', { x: 242, y: 32 });
    assertQuickAction(uiDiv.children[6], 'Connect', 'fa-solid fa-arrow-right-long', { x: 274, y: 32 });
  });

  it('create nodes quick actions are not rendered for comment element', () => {
    quickActionUi.show(root, 'comment');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 2);
    assertQuickAction(uiDiv.children[0], 'Delete');
    assertQuickAction(uiDiv.children[1], 'Connect');
  });

  it('create nodes quick actions are not rendered for end element', () => {
    quickActionUi.show(root, 'end');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 2);
    assertQuickAction(uiDiv.children[0], 'Delete');
    assertQuickAction(uiDiv.children[1], 'Attach Comment');
  });
});
