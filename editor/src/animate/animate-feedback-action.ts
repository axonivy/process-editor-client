import { SChildElement } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { Command, CommandExecutionContext, SModelRoot, TYPES } from 'sprotty';

import { Animateable, isAnimateable } from './model';

export class AnimateFeedbackAction {
  constructor(
    public readonly animatedIDs: string[] = [],
    public readonly deAnimatedIDs: string[] = [],
    public readonly kind: string = AnimateFeedbackCommand.KIND
  ) {}
}

@injectable()
export class AnimateFeedbackCommand extends Command {
  static readonly KIND = 'elementAnimateFeedback';

  protected animated: (SChildElement & Animateable)[] = [];
  protected deanimated: (SChildElement & Animateable)[] = [];

  constructor(@inject(TYPES.Action) protected readonly action: AnimateFeedbackAction) {
    super();
  }

  execute(context: CommandExecutionContext): SModelRoot {
    const model = context.root;
    this.action.animatedIDs.forEach(id => {
      const element = model.index.getById(id);
      if (element instanceof SChildElement && isAnimateable(element)) {
        this.animated.push(element);
      }
    });
    this.action.deAnimatedIDs.forEach(id => {
      const element = model.index.getById(id);
      if (element instanceof SChildElement && isAnimateable(element)) {
        this.deanimated.push(element);
      }
    });
    return this.redo(context);
  }

  undo(context: CommandExecutionContext): SModelRoot {
    for (const element of this.animated) {
      element.animated = false;
    }
    for (const element of this.deanimated) {
      element.animated = true;
    }
    return context.root;
  }

  redo(context: CommandExecutionContext): SModelRoot {
    for (const element of this.deanimated) {
      element.animated = false;
    }
    for (const element of this.animated) {
      element.animated = true;
    }
    return context.root;
  }
}
