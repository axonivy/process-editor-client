import { SModelRoot, TYPES } from '@eclipse-glsp/client';
import { Container } from 'inversify';

import ivyQuickActionModule, { configureQuickActionProviders } from '../../src/ui-tools/quick-action/di.config';
import { QuickActionUI } from '../../src/ui-tools/quick-action/quick-action-ui';
import { assertQuickAction, assertQuickActionUi, createContainer, createRoot, setupSprottyDiv } from './quick-action-ui-util';

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
    assertQuickActionUi(0);
  });

  it('ui is rendered for activity embedded element', () => {
    quickActionUi.show(root, 'sub');
    assertQuickActionUi(1, { x: 400, y: 150 });
    assertQuickAction(0, 'Jump (J)');
  });
});
