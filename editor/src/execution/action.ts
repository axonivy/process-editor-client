import { Action, hasArrayProp, IActionDispatcher, IActionHandler, IFeedbackActionDispatcher, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

import { ExecutedFeedbackAction, StoppedFeedbackAction } from './feedback-action';

export interface ElementExecution {
  elementId: string;
  count: number;
  failed: boolean;
}

export interface SetExecutedElementsAction extends Action {
  kind: typeof SetExecutedElementsAction.KIND;
  elementExecutions: ElementExecution[];
  lastExecutedElementId: string;
}

export namespace SetExecutedElementsAction {
  export const KIND = 'setExecutedElements';

  export function is(object: any): object is SetExecutedElementsAction {
    return Action.hasKind(object, KIND) && hasArrayProp(object, 'elementExecutions');
  }

  export function create(options: { elementExecutions: ElementExecution[]; lastExecutedElementId: string }): SetExecutedElementsAction {
    return {
      kind: KIND,
      ...options
    };
  }
}

@injectable()
export class SetExecutedElementsActionHandler implements IActionHandler {
  @inject(TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  oldExecutions: ElementExecution[];

  handle(action: Action): Action | void {
    if (SetExecutedElementsAction.is(action)) {
      const feedbackAction = ExecutedFeedbackAction.create({
        oldElementExecutions: this.oldExecutions,
        elementExecutions: action.elementExecutions,
        lastExecutedElementId: action.lastExecutedElementId
      });
      if (action.elementExecutions.length > 0) {
        this.feedbackDispatcher.registerFeedback(this, [feedbackAction]);
      } else {
        this.feedbackDispatcher.deregisterFeedback(this, [feedbackAction]);
      }
      this.oldExecutions = action.elementExecutions;
    }
  }
}

export interface StoppedAction extends Action {
  kind: typeof StoppedAction.KIND;
  elementId?: string;
}

export namespace StoppedAction {
  export const KIND = 'elementStopped';

  export function is(object: any): object is StoppedAction {
    return Action.hasKind(object, KIND);
  }

  export function create(options: { elementId?: string }): StoppedAction {
    return {
      kind: KIND,
      ...options
    };
  }
}

@injectable()
export class StoppedActionHandler implements IActionHandler {
  @inject(TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  oldStoppedElement: string;

  handle(action: Action): Action | void {
    if (StoppedAction.is(action)) {
      const feedbackAction = StoppedFeedbackAction.create({ oldStoppedElement: this.oldStoppedElement, stoppedElement: action.elementId });
      if (action.elementId && action.elementId.length > 0) {
        this.feedbackDispatcher.registerFeedback(this, [feedbackAction]);
      } else {
        this.feedbackDispatcher.deregisterFeedback(this, [feedbackAction]);
      }
      this.oldStoppedElement = action.elementId ?? '';
    }
  }
}
