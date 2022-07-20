import { Action, hasBooleanProp, IActionDispatcher, IActionHandler, IFeedbackActionDispatcher, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { GridFeedbackAction } from './feedback-action';

export interface ShowGridAction extends Action {
  kind: typeof ShowGridAction.KIND;
  show: boolean;
}

export namespace ShowGridAction {
  export const KIND = 'showGridAction';

  export function is(object: any): object is ShowGridAction {
    return Action.hasKind(object, KIND) && hasBooleanProp(object, 'show');
  }

  export function create(options: { show: boolean }): ShowGridAction {
    return {
      kind: KIND,
      ...options
    };
  }
}

@injectable()
export class ShowGridActionHandler implements IActionHandler {
  private show: boolean;

  @inject(TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;

  handle(action: Action): Action | void {
    if (ShowGridAction.is(action)) {
      this.show = action.show;
      if (action.show) {
        this.feedbackDispatcher.registerFeedback(this, [GridFeedbackAction.create({ show: action.show })]);
      } else {
        this.feedbackDispatcher.deregisterFeedback(this, [GridFeedbackAction.create({ show: action.show })]);
      }
    }
  }

  isVisible(): boolean {
    return this.show;
  }
}
