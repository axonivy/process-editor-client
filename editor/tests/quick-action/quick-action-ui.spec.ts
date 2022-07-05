import { SModelRoot } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { QuickActionUI } from '../../src/quick-action/quick-action-ui';
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
    assertQuickActionUi(uiDiv, 3, { x: 100, y: 100 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Attach Comment', 'fa-regular fa-message', { x: 210, y: 0 });
    assertQuickAction(uiDiv.children[2], 'Connect', 'fa-solid fa-arrow-right-long', { x: 242, y: 0 });
  });

  it('ui is rendered for activity embedded element', () => {
    quickActionUi.show(root, 'sub');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 4, { x: 300, y: 100 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Attach Comment', 'fa-regular fa-message', { x: 210, y: 0 });
    assertQuickAction(uiDiv.children[2], 'Connect', 'fa-solid fa-arrow-right-long', { x: 242, y: 0 });
    assertQuickAction(uiDiv.children[3], 'Jump (J)', 'fa-solid fa-turn-down', { x: -30, y: 60 });
  });

  it('ui is rendered for event element', () => {
    quickActionUi.show(root, 'start');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 3, { x: 200, y: 200 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Attach Comment', 'fa-regular fa-message', { x: 40, y: 0 });
    assertQuickAction(uiDiv.children[2], 'Connect', 'fa-solid fa-arrow-right-long', { x: 72, y: 0 });

    // no connection quick action if outgoing edge exists
    quickActionUi.show(root, 'startWithConnection');
    assertQuickActionUi(uiDiv, 2, { x: 200, y: 200 });

    quickActionUi.show(root, 'end');
    assertQuickActionUi(uiDiv, 2, { x: 300, y: 200 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Attach Comment', 'fa-regular fa-message', { x: 40, y: 0 });
  });

  it('ui is rendered for gateway element', () => {
    quickActionUi.show(root, 'alternative');
    const uiDiv = getQuickActionDiv();
    assertQuickActionUi(uiDiv, 3, { x: 100, y: 200 });
    assertQuickAction(uiDiv.children[0], 'Delete', 'fa-solid fa-trash', { x: -30, y: -30 });
    assertQuickAction(uiDiv.children[1], 'Attach Comment', 'fa-regular fa-message', { x: 42, y: 0 });
    assertQuickAction(uiDiv.children[2], 'Connect', 'fa-solid fa-arrow-right-long', { x: 74, y: 0 });

    // connection quick action even if outoging edge exists
    quickActionUi.show(root, 'alternativeWithConnection');
    assertQuickActionUi(uiDiv, 3, { x: 100, y: 200 });
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
