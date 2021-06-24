import '../../css/breakpoint.css';

import { configureView } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { configureActionHandler, configureCommand, TYPES } from 'sprotty';

import { BreakpointListener } from './breakpoint';
import { BreakpointFeedbackCommand } from './breakpoint-feedback-action';
import { SBreakpointHandle } from './model';
import { ShowBreakpointAction, ShowBreakpointActionHandler } from './show-breakpoint-action-handler';
import { SBreakpointHandleView } from './view';

const breakpointModule = new ContainerModule((bind, _unbind, isBound) => {
    bind(TYPES.MouseListener).to(BreakpointListener);
    bind(ShowBreakpointActionHandler).toSelf().inSingletonScope();
    configureActionHandler({ bind, isBound }, ShowBreakpointAction.KIND, ShowBreakpointActionHandler);
    configureCommand({ bind, isBound }, BreakpointFeedbackCommand);
    configureView({ bind, isBound }, SBreakpointHandle.TYPE, SBreakpointHandleView);
});

export default breakpointModule;
