import '../../css/jump-out.css';

import { configureActionHandler, configureCommand, TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../types';
import { JumpActionHandler, JumpQuickActionProvider } from './action';
import { JumpOutFeedbackCommand, JumpOutUi } from './jump-out-ui';
import { JumpAction } from '@axonivy/process-editor-protocol';

const ivyJumpModule = new ContainerModule((bind, _unbind, isBound, _rebind) => {
  bind(JumpOutUi).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(JumpOutUi);
  configureCommand({ bind, isBound }, JumpOutFeedbackCommand);
  bind(IVY_TYPES.QuickActionProvider).to(JumpQuickActionProvider);
  configureActionHandler({ bind, isBound }, JumpAction.KIND, JumpActionHandler);
});

export default ivyJumpModule;
