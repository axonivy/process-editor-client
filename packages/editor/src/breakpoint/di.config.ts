import './breakpoint.css';

import { configureActionHandler, configureCommand, configureView, FeatureModule, TYPES } from '@eclipse-glsp/client';

import { ShowBreakpointAction } from '@axonivy/process-editor-protocol';
import { IVY_TYPES } from '../types';
import { BreakpointQuickActionProvider } from './action';
import { ShowBreakpointActionHandler } from './action-handler';
import { BreakpointFeedbackCommand, BreakpointMouseListener } from './feedback-action';
import { SBreakpointHandle } from './model';
import { SBreakpointHandleView } from './view';

const ivyBreakpointModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(ShowBreakpointActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, ShowBreakpointAction.KIND, ShowBreakpointActionHandler);
  configureCommand({ bind, isBound }, BreakpointFeedbackCommand);
  configureView({ bind, isBound }, SBreakpointHandle.TYPE, SBreakpointHandleView);
  bind(IVY_TYPES.QuickActionProvider).to(BreakpointQuickActionProvider);
  bind(TYPES.MouseListener).to(BreakpointMouseListener);
});

export default ivyBreakpointModule;
