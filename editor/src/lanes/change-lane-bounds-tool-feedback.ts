import { FeedbackCommand, isNotUndefined } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { Action, CommandExecutionContext, CommandReturn, TYPES } from 'sprotty';

import { addLaneResizeHandles, isLaneResizable, removeLaneResizeHandles } from './model';

export class ShowChangeLaneBoundsToolFeedbackAction implements Action {
  constructor(readonly elementId?: string, public readonly kind: string = ShowChangeLaneBoundsToolFeedbackCommand.KIND) {}
}

export class HideChangeLaneBoundsToolFeedbackAction implements Action {
  constructor(public readonly kind: string = HideChangeLaneBoundsToolFeedbackCommand.KIND) {}
}

@injectable()
export class ShowChangeLaneBoundsToolFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'showChangeLaneBoundsToolFeedback';

  @inject(TYPES.Action) protected action: ShowChangeLaneBoundsToolFeedbackAction;

  execute(context: CommandExecutionContext): CommandReturn {
    const index = context.root.index;
    index.all().filter(isLaneResizable).forEach(removeLaneResizeHandles);

    if (isNotUndefined(this.action.elementId)) {
      const resizeElement = index.getById(this.action.elementId);
      if (isNotUndefined(resizeElement) && isLaneResizable(resizeElement)) {
        addLaneResizeHandles(resizeElement);
      }
    }
    return context.root;
  }
}

@injectable()
export class HideChangeLaneBoundsToolFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'hideChangeLaneBoundsToolResizeFeedback';

  @inject(TYPES.Action) protected action: HideChangeLaneBoundsToolFeedbackAction;

  execute(context: CommandExecutionContext): CommandReturn {
    const index = context.root.index;
    index.all().filter(isLaneResizable).forEach(removeLaneResizeHandles);
    return context.root;
  }
}
