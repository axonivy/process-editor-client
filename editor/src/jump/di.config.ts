import '../../css/smart-action.css';

import { configureCommand, configureView, GLSP_TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { JumpOutTool } from './jump-out-tool';
import { HideJumpOutToolFeedbackCommand, ShowJumpOutToolFeedbackCommand } from './jump-out-tool-feedback';
import { SJumpOutHandle } from './model';
import { SJumpOutHandleView } from './view';

const ivyJumpOutModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(GLSP_TYPES.IDefaultTool).to(JumpOutTool);
  configureCommand({ bind, isBound }, ShowJumpOutToolFeedbackCommand);
  configureCommand({ bind, isBound }, HideJumpOutToolFeedbackCommand);
  configureView({ bind, isBound }, SJumpOutHandle.TYPE, SJumpOutHandleView);
});

export default ivyJumpOutModule;
