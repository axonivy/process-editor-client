import { FeedbackCommand } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { Action, CommandExecutionContext, CommandReturn, TYPES } from 'sprotty';

import { addJumpOutHandles, removeJumpOutHandles } from './model';

export class ShowJumpOutToolFeedbackAction implements Action {
    constructor(readonly elementId?: string, public readonly kind: string = ShowJumpOutToolFeedbackCommand.KIND) { }
}

export class HideJumpOutToolFeedbackAction implements Action {
    constructor(public readonly kind: string = HideJumpOutToolFeedbackCommand.KIND) { }
}

@injectable()
export class ShowJumpOutToolFeedbackCommand extends FeedbackCommand {
    static readonly KIND = 'showJumpOutToolFeedback';

    @inject(TYPES.Action) protected action: ShowJumpOutToolFeedbackAction;

    execute(context: CommandExecutionContext): CommandReturn {
        const root = context.root;
        if (root.id.includes('-')) {
            addJumpOutHandles(root);
        }
        return context.root;
    }
}

@injectable()
export class HideJumpOutToolFeedbackCommand extends FeedbackCommand {
    static readonly KIND = 'hideJumpOutToolFeedback';

    @inject(TYPES.Action) protected action: HideJumpOutToolFeedbackAction;

    execute(context: CommandExecutionContext): CommandReturn {
        const index = context.root.index;
        index
            .all()
            .filter(() => true)
            .forEach(removeJumpOutHandles);
        return context.root;
    }
}
