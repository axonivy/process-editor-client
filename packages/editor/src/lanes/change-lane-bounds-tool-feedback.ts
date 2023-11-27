import { FeedbackCommand, isNotUndefined, Action, CommandExecutionContext, CommandReturn, TYPES, toArray } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

import { addLaneResizeHandles, isLaneResizable, removeLaneResizeHandles } from './model';

export interface ShowChangeLaneBoundsToolFeedbackAction extends Action {
  kind: typeof ShowChangeLaneBoundsToolFeedbackCommand.KIND;
  elementId?: string;
}

export namespace ShowChangeLaneBoundsToolFeedbackAction {
  export function create(elementId?: string): ShowChangeLaneBoundsToolFeedbackAction {
    return {
      kind: ShowChangeLaneBoundsToolFeedbackCommand.KIND,
      elementId
    };
  }
}

export interface HideChangeLaneBoundsToolFeedbackAction extends Action {
  kind: typeof HideChangeLaneBoundsToolFeedbackCommand.KIND;
}

export namespace HideChangeLaneBoundsToolFeedbackAction {
  export function create(): HideChangeLaneBoundsToolFeedbackAction {
    return {
      kind: HideChangeLaneBoundsToolFeedbackCommand.KIND
    };
  }
}

@injectable()
export class ShowChangeLaneBoundsToolFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'showChangeLaneBoundsToolFeedback';

  @inject(TYPES.Action) protected action: ShowChangeLaneBoundsToolFeedbackAction;

  execute(context: CommandExecutionContext): CommandReturn {
    const index = context.root.index;
    toArray(index.all()).filter(isLaneResizable).forEach(removeLaneResizeHandles);

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
    toArray(index.all()).filter(isLaneResizable).forEach(removeLaneResizeHandles);
    return context.root;
  }
}
