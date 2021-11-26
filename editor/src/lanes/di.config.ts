import { configureCommand, configureView, GLSP_TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../quick-action/quick-action';
import { CreateLaneQuickActionProvider } from './action';
import { ChangeLaneBoundsTool } from './change-lane-bounds-tool';
import { HideChangeLaneBoundsToolFeedbackCommand, ShowChangeLaneBoundsToolFeedbackCommand } from './change-lane-bounds-tool-feedback';
import { SLaneResizeHandle } from './model';
import { SLaneResizeHandleView } from './view';

const ivyLaneModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(IVY_TYPES.QuickActionProvider).to(CreateLaneQuickActionProvider);

  bind(GLSP_TYPES.IDefaultTool).to(ChangeLaneBoundsTool);
  configureCommand({ bind, isBound }, ShowChangeLaneBoundsToolFeedbackCommand);
  configureCommand({ bind, isBound }, HideChangeLaneBoundsToolFeedbackCommand);
  configureView({ bind, isBound }, SLaneResizeHandle.TYPE, SLaneResizeHandleView);
});

export default ivyLaneModule;
