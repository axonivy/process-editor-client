import { FeedbackCommand, isNotUndefined } from '@eclipse-glsp/client';
import { inject, injectable, multiInject } from 'inversify';
import { Action, CommandExecutionContext, CommandReturn, TYPES } from 'sprotty';

import {
  isQuickActionAware,
  IVY_TYPES,
  QuickActionHandle,
  QuickActionHandleLocation,
  QuickActionProvider,
  removeQuickActionHandles
} from './model';

export class ShowQuickActionToolFeedbackAction implements Action {
  constructor(readonly elementId?: string, public readonly kind: string = ShowQuickActionToolFeedbackCommand.KIND) { }
}

export class HideQuickActionToolFeedbackAction implements Action {
  constructor(public readonly kind: string = HideQuickActionToolFeedbackCommand.KIND) { }
}

@injectable()
export class ShowQuickActionToolFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'showQuickActionToolFeedback';

  @inject(TYPES.Action) protected action: ShowQuickActionToolFeedbackAction;
  @multiInject(IVY_TYPES.QuickActionProvider) protected quickActionProviders: QuickActionProvider[];

  execute(context: CommandExecutionContext): CommandReturn {
    const index = context.root.index;
    index
      .all()
      .filter(isQuickActionAware)
      .forEach(removeQuickActionHandles);

    if (isNotUndefined(this.action.elementId)) {
      const element = index.getById(this.action.elementId);
      if (isNotUndefined(element) && isQuickActionAware(element)) {
        const quickActions = this.quickActionProviders
          .map(provider => provider.quickActionForElement(element))
          .filter(isNotUndefined);
        Object.values(QuickActionHandleLocation).forEach(loc => {
          quickActions.filter(quick => quick.location === loc)
            .sort((a, b) => a.sorting.localeCompare(b.sorting))
            .forEach((quick, position) =>
              element.add(new QuickActionHandle(quick.icon, quick.location, position, quick.action)));
        });
      }
    }
    return context.root;
  }
}

@injectable()
export class HideQuickActionToolFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'hideQuickActionToolFeedback';

  @inject(TYPES.Action) protected action: HideQuickActionToolFeedbackAction;

  execute(context: CommandExecutionContext): CommandReturn {
    const index = context.root.index;
    index
      .all()
      .filter(isQuickActionAware)
      .forEach(removeQuickActionHandles);
    return context.root;
  }
}
