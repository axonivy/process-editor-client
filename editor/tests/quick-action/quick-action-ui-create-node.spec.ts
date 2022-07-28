import { SModelRoot, PaletteItem, EnableToolPaletteAction, configureActionHandler } from '@eclipse-glsp/client';
import { Container } from 'inversify';

import { QuickActionUI } from '../../src/ui-tools/quick-action/quick-action-ui';
import ivyToolBarModule from '../../src/ui-tools/tool-bar/di.config';
import { assertQuickAction, assertQuickActionUi, createContainer, createRoot, setupSprottyDiv } from './quick-action-ui-util';
import { ElementsPaletteHandler } from '../../src/ui-tools/tool-bar/node/action-handler';

class ElementsPaletteHandlerMock extends ElementsPaletteHandler {
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
  container.bind(ElementsPaletteHandlerMock).toSelf().inSingletonScope();
  configureActionHandler(container, EnableToolPaletteAction.KIND, ElementsPaletteHandler);
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
    assertQuickActionUi(7, { x: 200, y: 150 });
    assertQuickAction(0, 'Delete', 'fa-solid fa-trash');
    assertQuickAction(1, 'Information (I)', 'fa-solid fa-info');
    assertQuickAction(2, 'Select color', 'fa-solid fa-palette');
    assertQuickAction(3, 'Events (A)', 'fa-regular fa-circle');
    assertQuickAction(4, 'Gateways (A)', 'fa-regular fa-square fa-rotate-45');
    assertQuickAction(5, 'Activities (A)', 'fa-regular fa-square');
    assertQuickAction(6, 'Connect', 'fa-solid fa-arrow-right-long');
  });

  it('create nodes quick actions are not rendered for comment element', () => {
    quickActionUi.show(root, 'comment');
    assertQuickActionUi(4);
    assertQuickAction(0, 'Delete');
    assertQuickAction(2, 'Select color');
    assertQuickAction(3, 'Connect');
  });

  it('create nodes quick actions are not rendered for end element', () => {
    quickActionUi.show(root, 'end');
    assertQuickActionUi(3);
    assertQuickAction(0, 'Delete');
    assertQuickAction(2, 'Select color');
  });
});
