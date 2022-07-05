import { SModelRoot, TYPES } from '@eclipse-glsp/client';
import { Container } from 'inversify';

import ivyQuickActionModule, { configureQuickActionProviders, configureNodeCreationTool } from '../../src/quick-action/di.config';
import { QuickActionUI } from '../../src/quick-action/quick-action-ui';
import { assertQuickAction, assertQuickActionUi, createContainer, createRoot, getQuickActionDiv, setupSprottyDiv } from './quick-action-ui-util';

class QuickActionUIReadonly extends QuickActionUI {
  protected isReadonly(): boolean {
    return true;
  }
}

function createContainerReadonly(): Container {
  const container = createContainer();
  container.unload(ivyQuickActionModule);
  container.bind(QuickActionUIReadonly).toSelf().inSingletonScope();
  container.bind(TYPES.IUIExtension).toService(QuickActionUIReadonly);
  configureQuickActionProviders(container);
  configureNodeCreationTool(container);
  return container;
}

describe('QuickActionUi - Readonly', () => {
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
    assertQuickAction(uiDiv.children[0], 'Jump (J)');
  });
});
