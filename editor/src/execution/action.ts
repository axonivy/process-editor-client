import { Action, GLSP_TYPES, IActionDispatcher, IActionHandler, IFeedbackActionDispatcher, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

import { ExecutedFeedbackAction } from './feedback-action';

export interface ElementExecution {
  elementId: string;
  count: number;
  failed: boolean;
}

export class SetExecutedElementsAction implements Action {
  static readonly KIND = 'setExecutedElements';
  kind = SetExecutedElementsAction.KIND;

  constructor(public readonly elementExecutions: ElementExecution[]) {}
}

@injectable()
export class SetExecutedElementsActionHandler implements IActionHandler {
  @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  oldExecutions: ElementExecution[];

  handle(action: Action): Action | void {
    if (isSetExecutedElementsAction(action)) {
      const feedbackAction = new ExecutedFeedbackAction(this.oldExecutions, action.elementExecutions);
      if (action.elementExecutions.length > 0) {
        this.feedbackDispatcher.registerFeedback(this, [feedbackAction]);
      } else {
        this.feedbackDispatcher.deregisterFeedback(this, [feedbackAction]);
      }
      this.oldExecutions = action.elementExecutions;
    }
  }
}

export function isSetExecutedElementsAction(action: Action): action is SetExecutedElementsAction {
  return (
    action !== undefined &&
    action.kind === SetExecutedElementsAction.KIND &&
    (action as SetExecutedElementsAction).elementExecutions !== undefined
  );
}
