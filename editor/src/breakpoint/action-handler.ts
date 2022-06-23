import { IFeedbackActionDispatcher } from '@eclipse-glsp/client/lib/features/tool-feedback/feedback-action-dispatcher';
import { inject, injectable } from 'inversify';
import { Action, hasArrayProp, hasBooleanProp, IActionHandler, TYPES } from '@eclipse-glsp/client';

import { BreakpointFeedbackAction } from './feedback-action';

export interface ElementBreakpoint {
  elementId: string;
  condition: string;
  disabled: boolean;
}

export interface ShowBreakpointAction extends Action {
  kind: typeof ShowBreakpointAction.KIND;
  elementBreakpoints: ElementBreakpoint[];
  globalDisabled: boolean;
}

export namespace ShowBreakpointAction {
  export const KIND = 'showBreakpoints';

  export function is(object: any): object is ShowBreakpointAction {
    return Action.hasKind(object, KIND) && hasArrayProp(object, 'elementBreakpoints') && hasBooleanProp(object, 'globalDisabled');
  }

  export function create(options: { elementBreakpoints: ElementBreakpoint[]; globalDisabled: boolean }): ShowBreakpointAction {
    return {
      kind: KIND,
      ...options
    };
  }
}

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
