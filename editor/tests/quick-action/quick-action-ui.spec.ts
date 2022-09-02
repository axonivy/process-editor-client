import { SModelRoot } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { QuickActionUI } from '../../src/ui-tools/quick-action/quick-action-ui';
import { assertMultiQuickActionUi, assertQuickAction, assertQuickActionUi, createContainer, createRoot, getQuickActionDiv, setupSprottyDiv } from './quick-action-ui-util';
import { StreamlineIcons } from '../../src/StreamlineIcons';

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
    assertQuickActionUi(7, { x: 265, y: 215 });
    assertQuickAction(0, 'Delete', `si si-${StreamlineIcons.Delete}`);
    assertQuickAction(1, 'Information (I)', `si si-${StreamlineIcons.Information}`);
    assertQuickAction(2, 'Straighten (S)', `si si-${StreamlineIcons.Straighten}`);
    assertQuickAction(3, 'Bend (B)', `si si-${StreamlineIcons.Bend}`);
    assertQuickAction(4, 'Edit Label (L)', `si si-${StreamlineIcons.Label}`);
    assertQuickAction(5, 'Select color', `si si-${StreamlineIcons.Color}`);
    assertQuickAction(6, 'Reconnect (C)', `si si-${StreamlineIcons.Reconnect}`);
  });

  it('ui is rendered for activity element', () => {
    quickActionUi.show(root, 'foo');
    assertQuickActionUi(7, { x: 200, y: 150 });
    assertQuickAction(0, 'Delete', `si si-${StreamlineIcons.Delete}`);
    assertQuickAction(1, 'Information (I)', `si si-${StreamlineIcons.Information}`);
    assertQuickAction(2, 'Select color', `si si-${StreamlineIcons.Color}`);
    assertQuickAction(6, 'Connect', `si si-${StreamlineIcons.Connector}`);
  });

  it('ui is rendered for activity embedded element', () => {
    quickActionUi.show(root, 'sub');
    assertQuickActionUi(8, { x: 400, y: 150 });
    assertQuickAction(0, 'Delete', `si si-${StreamlineIcons.Delete}`);
    assertQuickAction(1, 'Information (I)', `si si-${StreamlineIcons.Information}`);

    assertQuickAction(2, 'Jump (J)', `si si-${StreamlineIcons.Jump}`);
    assertQuickAction(3, 'Select color', `si si-${StreamlineIcons.Color}`);
    assertQuickAction(7, 'Connect', `si si-${StreamlineIcons.Connector}`);
  });

  it('ui is rendered for event element', () => {
    quickActionUi.show(root, 'start');
    assertQuickActionUi(7, { x: 215, y: 230 });
    assertQuickAction(0, 'Delete', `si si-${StreamlineIcons.Delete}`);
    assertQuickAction(1, 'Information (I)', `si si-${StreamlineIcons.Information}`);
    assertQuickAction(2, 'Select color', `si si-${StreamlineIcons.Color}`);
    assertQuickAction(6, 'Connect', `si si-${StreamlineIcons.Connector}`);

    // no connection quick action if outgoing edge exists
    quickActionUi.show(root, 'startWithConnection');
    assertQuickActionUi(6);
  });

  it('ui is rendered for gateway element', () => {
    quickActionUi.show(root, 'alternative');
    assertQuickActionUi(7, { x: 116, y: 232 });
    assertQuickAction(0, 'Delete', `si si-${StreamlineIcons.Delete}`);
    assertQuickAction(1, 'Information (I)', `si si-${StreamlineIcons.Information}`);
    assertQuickAction(2, 'Select color', `si si-${StreamlineIcons.Color}`);
    assertQuickAction(6, 'Connect', `si si-${StreamlineIcons.Connector}`);

    // connection quick action even if outoging edge exists
    quickActionUi.show(root, 'alternativeWithConnection');
    assertQuickActionUi(7);
  });

  it('ui is rendered for pool', () => {
    quickActionUi.show(root, 'pool');
    assertQuickActionUi(3, { x: 250, y: 100 });
    assertQuickAction(0, 'Delete', `si si-${StreamlineIcons.Delete}`);
    assertQuickAction(1, 'Select color', `si si-${StreamlineIcons.Color}`);
    assertQuickAction(2, 'Create Lane', `si si-${StreamlineIcons.LaneSwimlanes}`);
  });

  it('ui is rendered for lane', () => {
    quickActionUi.show(root, 'lane');
    assertQuickActionUi(2, { x: 250, y: 200 });
    assertQuickAction(0, 'Delete', `si si-${StreamlineIcons.Delete}`);
    assertQuickAction(1, 'Select color', `si si-${StreamlineIcons.Color}`);
  });

  it('multi selection ui is rendered', () => {
    quickActionUi.show(root, 'start', 'end');
    assertMultiQuickActionUi(4, { height: 40, width: 140 }, { x: 265, y: 230 });
    assertQuickAction(0, 'Delete', `si si-${StreamlineIcons.Delete}`);
    assertQuickAction(1, 'Wrap to embedded process (S)', `si si-${StreamlineIcons.WrapToSubprocess}`);
    assertQuickAction(2, 'Auto Align (A)', `si si-${StreamlineIcons.AutoAlign}`);
    assertQuickAction(3, 'Select color', `si si-${StreamlineIcons.Color}`);

    quickActionUi.show(root, 'start', 'end', 'foo');
    assertMultiQuickActionUi(4, { height: 140, width: 240 }, { x: 215, y: 230 });
  });
});
