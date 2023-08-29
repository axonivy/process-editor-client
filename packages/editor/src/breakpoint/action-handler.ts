import { IFeedbackActionDispatcher } from '@eclipse-glsp/client/lib/features/tool-feedback/feedback-action-dispatcher';
import { inject, injectable } from 'inversify';
import { Action, IActionHandler, TYPES } from '@eclipse-glsp/client';

import { BreakpointFeedbackAction } from './feedback-action';
import { ElementBreakpoint, ShowBreakpointAction } from '@axonivy/process-editor-protocol';

@injectable()
export class ShowBreakpointActionHandler implements IActionHandler {
  private oldBreakpoints: ElementBreakpoint[] = [];

  @inject(TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;

  handle(action: Action): Action | void {
    if (ShowBreakpointAction.is(action)) {
      const breakpointFeedback = BreakpointFeedbackAction.create({
        breakpoints: action.elementBreakpoints,
        oldBreakpoints: this.oldBreakpoints,
        globalDisabled: action.globalDisabled
      });
      this.feedbackDispatcher.registerFeedback(this, [breakpointFeedback]);
      this.oldBreakpoints = action.elementBreakpoints;
    }
  }
}
