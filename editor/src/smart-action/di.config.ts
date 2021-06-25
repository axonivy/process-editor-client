import '../../css/smart-action.css';

import { configureActionHandler, configureCommand, configureView, GLSP_TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { SmartActionEdgeCreationTool, SmartActionTriggerEdgeCreationAction } from './edge/edge-creation-tool';
import { SSmartActionHandle } from './model';
import { SmartActionTool } from './smart-action-tool';
import { HideSmartActionToolFeedbackCommand, ShowSmartActionToolFeedbackCommand } from './smart-action-tool-feedback';
import { SSmartActionHandleView } from './view';

const ivySmartActionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(GLSP_TYPES.IDefaultTool).to(SmartActionTool);
  configureCommand({ bind, isBound }, ShowSmartActionToolFeedbackCommand);
  configureCommand({ bind, isBound }, HideSmartActionToolFeedbackCommand);
  configureView({ bind, isBound }, SSmartActionHandle.TYPE, SSmartActionHandleView);

  bind(SmartActionEdgeCreationTool).toSelf().inSingletonScope();
  bind(GLSP_TYPES.ITool).toService(SmartActionEdgeCreationTool);
  configureActionHandler({ bind, isBound }, SmartActionTriggerEdgeCreationAction.KIND, SmartActionEdgeCreationTool);
});

export default ivySmartActionModule;
