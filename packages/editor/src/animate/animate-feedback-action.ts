import { GChildElement, Command, CommandExecutionContext, GModelRoot, TYPES, Action } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { addCssClass, removeCssClass } from '../utils/element-css-classes';

import { isAnimateable } from './model';

export interface AnimateFeedbackAction extends Action {
  kind: typeof AnimateFeedbackCommand.KIND;
  animatedIDs: string[];
  deAnimatedIDs?: string[];
}

export namespace AnimateFeedbackAction {
  export function create(options: { animatedIDs: string[]; deAnimatedIDs?: string[] }): AnimateFeedbackAction {
    return {
      kind: AnimateFeedbackCommand.KIND,
      ...options
    };
  }
}

@injectable()
export class AnimateFeedbackCommand extends Command {
  static readonly KIND = 'elementAnimateFeedback';
  static readonly CSS_CLASS = 'animate';

  protected animated: GChildElement[] = [];
  protected deanimated: GChildElement[] = [];

  constructor(@inject(TYPES.Action) protected readonly action: AnimateFeedbackAction) {
    super();
  }

  execute(context: CommandExecutionContext): GModelRoot {
    const model = context.root;
    this.action.animatedIDs.forEach(id => {
      const element = model.index.getById(id);
      if (element instanceof GChildElement && isAnimateable(element)) {
        this.animated.push(element);
      }
    });
    this.action.deAnimatedIDs?.forEach(id => {
      const element = model.index.getById(id);
      if (element instanceof GChildElement && isAnimateable(element)) {
        this.deanimated.push(element);
      }
    });
    return this.redo(context);
  }

  undo(context: CommandExecutionContext): GModelRoot {
    for (const element of this.animated) {
      removeCssClass(element, AnimateFeedbackCommand.CSS_CLASS);
    }
    for (const element of this.deanimated) {
      addCssClass(element, AnimateFeedbackCommand.CSS_CLASS);
    }
    return context.root;
  }

  redo(context: CommandExecutionContext): GModelRoot {
    for (const element of this.deanimated) {
      removeCssClass(element, AnimateFeedbackCommand.CSS_CLASS);
    }
    for (const element of this.animated) {
      addCssClass(element, AnimateFeedbackCommand.CSS_CLASS);
    }
    return context.root;
  }
}
