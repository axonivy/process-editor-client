import { Action, GLSP_TYPES, IActionDispatcher, IActionHandler, IFeedbackActionDispatcher, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

import { ExecutedFeedbackAction, StoppedFeedbackAction } from './feedback-action';

export interface ElementExecution {
  elementId: string;
  count: number;
  failed: boolean;
}

export class SetExecutedElementsAction implements Action {
  static readonly KIND = 'setExecutedElements';
  kind = SetExecutedElementsAction.KIND;

  constructor(public readonly elementExecutions: ElementExecution[], public readonly lastExecutedElementId: string = '') {}
}

@injectable()
export class SetExecutedElementsActionHandler implements IActionHandler {
  @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  oldExecutions: ElementExecution[];

  handle(action: Action): Action | void {
    if (isSetExecutedElementsAction(action)) {
      const feedbackAction = new ExecutedFeedbackAction(this.oldExecutions, action.elementExecutions, action.lastExecutedElementId);
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

export class StoppedAction implements Action {
  static readonly KIND = 'elementStopped';
  kind = StoppedAction.KIND;

  constructor(public readonly elementId: string) {}
}

@injectable()
export class StoppedActionHandler implements IActionHandler {
  @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  oldStoppedElement: string;

  handle(action: Action): Action | void {
    if (isStoppedAction(action)) {
      const feedbackAction = new StoppedFeedbackAction(this.oldStoppedElement, action.elementId);
      if (action.elementId && action.elementId.length > 0) {
        this.feedbackDispatcher.registerFeedback(this, [feedbackAction]);
      } else {
        this.feedbackDispatcher.deregisterFeedback(this, [feedbackAction]);
      }
      this.oldStoppedElement = action.elementId;
    }
  }
}

export function isStoppedAction(action: Action): action is StoppedAction {
  return action !== undefined && action.kind === StoppedAction.KIND;
}
