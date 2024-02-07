import './jump-out.css';

import { configureActionHandler, configureCommand, FeatureModule, TYPES } from '@eclipse-glsp/client';

import { JumpAction } from '@axonivy/process-editor-protocol';
import { IVY_TYPES } from '../types';
import { JumpActionHandler, JumpQuickActionProvider } from './action';
import { JumpOutFeedbackCommand, JumpOutUi } from './jump-out-ui';

const ivyJumpModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(JumpOutUi).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(JumpOutUi);
  configureCommand({ bind, isBound }, JumpOutFeedbackCommand);
  bind(IVY_TYPES.QuickActionProvider).to(JumpQuickActionProvider);
  configureActionHandler({ bind, isBound }, JumpAction.KIND, JumpActionHandler);
});

export default ivyJumpModule;
