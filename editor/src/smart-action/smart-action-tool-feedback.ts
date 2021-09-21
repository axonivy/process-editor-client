import { FeedbackCommand, isNotUndefined } from '@eclipse-glsp/client';
import { inject, injectable, multiInject } from 'inversify';
import { Action, CommandExecutionContext, CommandReturn, TYPES } from 'sprotty';

import {
  isSmartable,
  IVY_TYPES,
  QuickActionHandleLocation,
  QuickActionProvider,
  removeSmartActionHandles,
  SSmartActionHandle
} from './model';

export class ShowSmartActionToolFeedbackAction implements Action {
  constructor(readonly elementId?: string, public readonly kind: string = ShowSmartActionToolFeedbackCommand.KIND) { }
}

export class HideSmartActionToolFeedbackAction implements Action {
  constructor(public readonly kind: string = HideSmartActionToolFeedbackCommand.KIND) { }
}

@injectable()
export class ShowSmartActionToolFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'showSmartActionToolFeedback';

  @inject(TYPES.Action) protected action: ShowSmartActionToolFeedbackAction;
  @multiInject(IVY_TYPES.QuickActionProvider) protected quickActionProviders: QuickActionProvider[];

  execute(context: CommandExecutionContext): CommandReturn {
    const index = context.root.index;
    index
      .all()
      .filter(isSmartable)
      .forEach(removeSmartActionHandles);

    if (isNotUndefined(this.action.elementId)) {
      const element = index.getById(this.action.elementId);
      if (isNotUndefined(element) && isSmartable(element)) {
        const quickActions = this.quickActionProviders
          .map(provider => provider.quickActionForElement(element))
          .filter(isNotUndefined);
        Object.values(QuickActionHandleLocation).forEach(loc => {
          quickActions.filter(quick => quick.location === loc)
            .sort((a, b) => a.sorting.localeCompare(b.sorting))
            .forEach((quick, position) =>
              element.add(new SSmartActionHandle(quick.icon, quick.location, position, quick.action)));
        });
      }
    }
    return context.root;
  }
}

@injectable()
export class HideSmartActionToolFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'hideSmartActionToolFeedback';

  @inject(TYPES.Action) protected action: HideSmartActionToolFeedbackAction;

  execute(context: CommandExecutionContext): CommandReturn {
    const index = context.root.index;
    index
      .all()
      .filter(isSmartable)
      .forEach(removeSmartActionHandles);
    return context.root;
  }
}
