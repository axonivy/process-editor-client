import { inject, injectable } from 'inversify';
import { Command, CommandExecutionContext, SChildElement, SModelRoot, TYPES } from 'sprotty';

import { addBreakpointHandles, Breakable, isBreakable, removeBreakpointHandles } from './model';

export class BreakpointFeedbackAction {
  constructor(
    public readonly showBreakpointElementIds: string[] = [],
    public readonly hideBreakpointElementIds: string[] = [],
    public readonly kind: string = BreakpointFeedbackCommand.KIND
  ) {}
}

@injectable()
export class BreakpointFeedbackCommand extends Command {
  static readonly KIND = 'elementBreakpointFeedback';

  protected showBreakpoints: (SChildElement & Breakable)[] = [];
  protected hideBreakpoints: (SChildElement & Breakable)[] = [];

  constructor(@inject(TYPES.Action) protected readonly action: BreakpointFeedbackAction) {
    super();
  }

  execute(context: CommandExecutionContext): SModelRoot {
    this.analyzeFeedbackAction(context.root);
    return this.redo(context);
  }

  undo(context: CommandExecutionContext): SModelRoot {
    return context.root;
  }

  redo(context: CommandExecutionContext): SModelRoot {
    for (const element of this.showBreakpoints) {
      addBreakpointHandles(element);
    }
    for (const element of this.hideBreakpoints) {
      removeBreakpointHandles(element);
    }
    return context.root;
  }

  analyzeFeedbackAction(model: SModelRoot): void {
    this.action.showBreakpointElementIds.forEach(id => {
      const element = model.index.getById(id);
      if (element instanceof SChildElement && isBreakable(element)) {
        this.showBreakpoints.push(element);
      }
    });
    this.action.hideBreakpointElementIds.forEach(id => {
      const element = model.index.getById(id);
      if (element instanceof SChildElement && isBreakable(element)) {
        this.hideBreakpoints.push(element);
      }
    });
  }
}
