import '../../css/breakpoint.css';

import { ContainerModule } from 'inversify';
import { configureActionHandler, configureCommand, configureView, TYPES } from '@eclipse-glsp/client';

import { IVY_TYPES } from '../types';
import { BreakpointQuickActionProvider } from './action';
import { ShowBreakpointAction, ShowBreakpointActionHandler } from './action-handler';
import { BreakpointFeedbackCommand, BreakpointMouseListener } from './feedback-action';
import { SBreakpointHandle } from './model';
import { SBreakpointHandleView } from './view';

const ivyBreakpointModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(ShowBreakpointActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, ShowBreakpointAction.KIND, ShowBreakpointActionHandler);
  configureCommand({ bind, isBound }, BreakpointFeedbackCommand);
  configureView({ bind, isBound }, SBreakpointHandle.TYPE, SBreakpointHandleView);
  bind(IVY_TYPES.QuickActionProvider).to(BreakpointQuickActionProvider);
  bind(TYPES.MouseListener).to(BreakpointMouseListener);
});

export default ivyBreakpointModule;
