import { configureCommand, configureView, FeatureModule, TYPES } from '@eclipse-glsp/client';

import { IVY_TYPES } from '../types';
import { CreateLaneQuickActionProvider } from './action';
import { ChangeLaneBoundsTool } from './change-lane-bounds-tool';
import { HideChangeLaneBoundsToolFeedbackCommand, ShowChangeLaneBoundsToolFeedbackCommand } from './change-lane-bounds-tool-feedback';
import { SLaneResizeHandle } from './model';
import { SLaneResizeHandleView } from './view';

const ivyLaneModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(IVY_TYPES.QuickActionProvider).to(CreateLaneQuickActionProvider);

  bind(TYPES.IDefaultTool).to(ChangeLaneBoundsTool);
  configureCommand({ bind, isBound }, ShowChangeLaneBoundsToolFeedbackCommand);
  configureCommand({ bind, isBound }, HideChangeLaneBoundsToolFeedbackCommand);
  configureView({ bind, isBound }, SLaneResizeHandle.TYPE, SLaneResizeHandleView);
});

export default ivyLaneModule;
