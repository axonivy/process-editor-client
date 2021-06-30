import { GLSP_TYPES } from '@eclipse-glsp/client/lib/base/types';
import { IFeedbackActionDispatcher } from '@eclipse-glsp/client/lib/features/tool-feedback/feedback-action-dispatcher';
import { inject, injectable } from 'inversify';
import { Action, IActionHandler } from 'sprotty';

import { BreakpointFeedbackAction } from './breakpoint-feedback-action';

export class ShowBreakpointAction implements Action {
  static readonly KIND = 'showBreakpoints';
  kind = ShowBreakpointAction.KIND;

  constructor(public readonly elementIds: string[] = []) {
  }
}

@injectable()
export class ShowBreakpointActionHandler implements IActionHandler {

  private breakpointElementIDs: Set<string> = new Set();

  @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;

  handle(action: Action): Action | void {
    if (isShowBreakpointAction(action)) {
      const showBreakpointIds = action.elementIds;
      const hideBreakpointIds: string[] = [];
      for (const id of this.breakpointElementIDs) {
        if (!showBreakpointIds.includes(id)) {
          hideBreakpointIds.push(id);
        }
      }
      for (const id of showBreakpointIds) {
        this.breakpointElementIDs.add(id);
      }
      const breakpointFeedback = new BreakpointFeedbackAction(showBreakpointIds, hideBreakpointIds);
      this.feedbackDispatcher.registerFeedback(this, [breakpointFeedback]);
    }
  }
}

export function isShowBreakpointAction(action: Action): action is ShowBreakpointAction {
  return action !== undefined && (action.kind === ShowBreakpointAction.KIND)
    && (action as ShowBreakpointAction).elementIds !== undefined;
}
