import { Action, hasArrayProp, IActionDispatcher, IActionHandler, IFeedbackActionDispatcher, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { MoveIntoViewportAction } from '../ui-tools/viewport/viewport-commands';

import { AnimateFeedbackAction } from './animate-feedback-action';

export interface AnimateAction extends Action {
  kind: typeof AnimateAction.KIND;
  elementIds: string[];
}

export namespace AnimateAction {
  export const KIND = 'elementAnimate';

  export function is(object: any): object is AnimateAction {
    return Action.hasKind(object, KIND) && hasArrayProp(object, 'elementIds');
  }

  export function create(options: { elementIds: string[] }): AnimateAction {
    return {
      kind: KIND,
      ...options
    };
  }
}

@injectable()
export class AnimateActionHandler implements IActionHandler {
  private animateElementIDs: Set<string> = new Set();

  @inject(TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;

  handle(action: Action): Action | void {
    if (AnimateAction.is(action)) {
      for (const id of action.elementIds) {
        this.animateElementIDs.add(id);
        const animateFeedback = AnimateFeedbackAction.create({ animatedIDs: [...this.animateElementIDs] });
        this.feedbackDispatcher.registerFeedback(this, [animateFeedback]);
        this.actionDispatcher.dispatch(MoveIntoViewportAction.create({ elementIds: [id] }));
        setTimeout(() => {
          this.animateElementIDs.delete(id);
          this.feedbackDispatcher.registerFeedback(this, [
            AnimateFeedbackAction.create({ animatedIDs: [...this.animateElementIDs], deAnimatedIDs: [id] })
          ]);
          if (this.animateElementIDs.size === 0) {
            this.feedbackDispatcher.deregisterFeedback(this, []);
          }
        }, 2000);
      }
    }
  }
}
