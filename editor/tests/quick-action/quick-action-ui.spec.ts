import { SModelRoot } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { QuickActionUI } from '../../src/ui-tools/quick-action/quick-action-ui';
import { assertMultiQuickActionUi, assertQuickAction, assertQuickActionUi, createContainer, createRoot, getQuickActionDiv, setupSprottyDiv } from './quick-action-ui-util';

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
    assertQuickActionUi(0);
  });

  it('ui is rendered for edges', () => {
    quickActionUi.show(root, 'edge');
    assertQuickActionUi(5, { x: 265, y: 215 });
    assertQuickAction(0, 'Delete', 'fa-solid fa-trash');
    assertQuickAction(1, 'Straighten (S)', 'fa-solid fa-arrows-left-right');
    assertQuickAction(2, 'Bend (B)', 'fa-solid fa-ruler-combined');
    assertQuickAction(3, 'Edit Label (L)', 'fa-solid fa-tag');
    assertQuickAction(4, 'Select color', 'fa-solid fa-palette');
  });

  it('ui is rendered for activity element', () => {
    quickActionUi.show(root, 'foo');
    assertQuickActionUi(6, { x: 200, y: 150 });
    assertQuickAction(0, 'Delete', 'fa-solid fa-trash');
    assertQuickAction(1, 'Select color', 'fa-solid fa-palette');
    assertQuickAction(5, 'Connect', 'fa-solid fa-arrow-right-long');
  });

  it('ui is rendered for activity embedded element', () => {
    quickActionUi.show(root, 'sub');
    assertQuickActionUi(7, { x: 400, y: 150 });
    assertQuickAction(0, 'Delete', 'fa-solid fa-trash');
    assertQuickAction(1, 'Jump (J)', 'fa-solid fa-turn-down');
    assertQuickAction(2, 'Select color', 'fa-solid fa-palette');
    assertQuickAction(6, 'Connect', 'fa-solid fa-arrow-right-long');
  });

  it('ui is rendered for event element', () => {
    quickActionUi.show(root, 'start');
    assertQuickActionUi(6, { x: 215, y: 230 });
    assertQuickAction(0, 'Delete', 'fa-solid fa-trash');
    assertQuickAction(1, 'Select color', 'fa-solid fa-palette');
    assertQuickAction(5, 'Connect', 'fa-solid fa-arrow-right-long');

    // no connection quick action if outgoing edge exists
    quickActionUi.show(root, 'startWithConnection');
    assertQuickActionUi(5);
  });

  it('ui is rendered for gateway element', () => {
    quickActionUi.show(root, 'alternative');
    assertQuickActionUi(6, { x: 116, y: 232 });
    assertQuickAction(0, 'Delete', 'fa-solid fa-trash');
    assertQuickAction(1, 'Select color', 'fa-solid fa-palette');
    assertQuickAction(5, 'Connect', 'fa-solid fa-arrow-right-long');

    // connection quick action even if outoging edge exists
    quickActionUi.show(root, 'alternativeWithConnection');
    assertQuickActionUi(6);
  });

  it('ui is rendered for pool', () => {
    quickActionUi.show(root, 'pool');
    assertQuickActionUi(3, { x: 250, y: 100 });
    assertQuickAction(0, 'Delete', 'fa-solid fa-trash');
    assertQuickAction(1, 'Select color', 'fa-solid fa-palette');
    assertQuickAction(2, 'Create Lane', 'fa-solid fa-table-columns fa-rotate-270');
  });

  it('ui is rendered for lane', () => {
    quickActionUi.show(root, 'lane');
    assertQuickActionUi(2, { x: 250, y: 200 });
    assertQuickAction(0, 'Delete', 'fa-solid fa-trash');
    assertQuickAction(1, 'Select color', 'fa-solid fa-palette');
  });

  it('multi selection ui is rendered', () => {
    quickActionUi.show(root, 'start', 'end');
    assertMultiQuickActionUi(4, { height: 40, width: 140 }, { x: 265, y: 230 });
    assertQuickAction(0, 'Delete', 'fa-solid fa-trash');
    assertQuickAction(1, 'Wrap to embedded process (S)', 'fa-solid fa-minimize');
    assertQuickAction(2, 'Auto Align (A)', 'fa-solid fa-up-down-left-right');
    assertQuickAction(3, 'Select color', 'fa-solid fa-palette');

    quickActionUi.show(root, 'start', 'end', 'foo');
    assertMultiQuickActionUi(4, { height: 140, width: 240 }, { x: 215, y: 230 });
  });
});
