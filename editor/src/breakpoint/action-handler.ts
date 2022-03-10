import { GLSP_TYPES } from '@eclipse-glsp/client/lib/base/types';
import { IFeedbackActionDispatcher } from '@eclipse-glsp/client/lib/features/tool-feedback/feedback-action-dispatcher';
import { inject, injectable } from 'inversify';
import { Action, IActionHandler } from 'sprotty';

import { BreakpointFeedbackAction } from './feedback-action';

export interface ElementBreakpoint {
  elementId: string;
  condition: string;
  disabled: boolean;
}

export class ShowBreakpointAction implements Action {
  static readonly KIND = 'showBreakpoints';
  kind = ShowBreakpointAction.KIND;

  constructor(public readonly elementBreakpoints: ElementBreakpoint[] = [], public readonly globalDisabled: boolean) {}
}

@injectable()
export class ShowBreakpointActionHandler implements IActionHandler {
  private oldBreakpoints: ElementBreakpoint[] = [];

  @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;

  handle(action: Action): Action | void {
    if (isShowBreakpointAction(action)) {
      const breakpointFeedback = new BreakpointFeedbackAction(action.elementBreakpoints, this.oldBreakpoints, action.globalDisabled);
      this.feedbackDispatcher.registerFeedback(this, [breakpointFeedback]);
      this.oldBreakpoints = action.elementBreakpoints;
    }
  }
}

export function isShowBreakpointAction(action: Action): action is ShowBreakpointAction {
  return (
    action !== undefined && action.kind === ShowBreakpointAction.KIND && (action as ShowBreakpointAction).elementBreakpoints !== undefined
  );
}
