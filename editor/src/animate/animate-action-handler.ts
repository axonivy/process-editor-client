import { Action, GLSP_TYPES, IActionDispatcher, IActionHandler, IFeedbackActionDispatcher, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { MoveIntoViewportAction } from '../viewport/move-into-viewport';

import { AnimateFeedbackAction } from './animate-feedback-action';

export class AnimateAction implements Action {
  static readonly KIND = 'elementAnimate';
  kind = AnimateAction.KIND;

  constructor(public readonly elementsIDs: string[] = []) {}
}

@injectable()
export class AnimateActionHandler implements IActionHandler {
  private animateElementIDs: Set<string> = new Set();

  @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;

  handle(action: Action): Action | void {
    if (isAnimateAction(action)) {
      for (const id of action.elementsIDs) {
        this.animateElementIDs.add(id);
        const animateFeedback = new AnimateFeedbackAction([...this.animateElementIDs]);
        this.feedbackDispatcher.registerFeedback(this, [animateFeedback]);
        this.actionDispatcher.dispatch(new MoveIntoViewportAction([id]));
        setTimeout(() => {
          this.animateElementIDs.delete(id);
          this.feedbackDispatcher.registerFeedback(this, [new AnimateFeedbackAction([...this.animateElementIDs], [id])]);
          if (this.animateElementIDs.size === 0) {
            this.feedbackDispatcher.deregisterFeedback(this, []);
          }
        }, 2000);
      }
    }
  }
}

export function isAnimateAction(action: Action): action is AnimateAction {
  return action !== undefined && action.kind === AnimateAction.KIND && (action as AnimateAction).elementsIDs !== undefined;
}
