import '../../css/quick-action.css';

import { configureActionHandler, configureCommand, configureView, GLSP_TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { QuickActionEdgeCreationTool, QuickActionTriggerEdgeCreationAction } from './edge/edge-creation-tool';
import {
  ConnectQuickActionProvider,
  DeleteQuickActionProvider,
  InscribeQuickActionProvider,
  IVY_TYPES,
  JumpQuickActionProvider,
  QuickActionHandle
} from './model';
import { QuickActionTool } from './quick-action-tool';
import { HideQuickActionToolFeedbackCommand, ShowQuickActionToolFeedbackCommand } from './quick-action-tool-feedback';
import { QuickActionHandleView } from './view';

const ivyQuickActionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(GLSP_TYPES.IDefaultTool).to(QuickActionTool);
  configureCommand({ bind, isBound }, ShowQuickActionToolFeedbackCommand);
  configureCommand({ bind, isBound }, HideQuickActionToolFeedbackCommand);
  configureView({ bind, isBound }, QuickActionHandle.TYPE, QuickActionHandleView);

  bind(QuickActionEdgeCreationTool).toSelf().inSingletonScope();
  bind(GLSP_TYPES.ITool).toService(QuickActionEdgeCreationTool);
  configureActionHandler({ bind, isBound }, QuickActionTriggerEdgeCreationAction.KIND, QuickActionEdgeCreationTool);

  bind(IVY_TYPES.QuickActionProvider).to(DeleteQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(InscribeQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(ConnectQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(JumpQuickActionProvider);
});

export default ivyQuickActionModule;
