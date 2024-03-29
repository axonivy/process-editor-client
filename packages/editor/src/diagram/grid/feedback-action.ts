import { Command, CommandExecutionContext, GModelRoot, TYPES, Action } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { addCssClass, removeCssClass } from '../../utils/element-css-classes';

export interface GridFeedbackAction extends Action {
  kind: typeof GridFeedbackCommand.KIND;
  show: boolean;
}

export namespace GridFeedbackAction {
  export function create(options: { show: boolean }): GridFeedbackAction {
    return {
      kind: GridFeedbackCommand.KIND,
      ...options
    };
  }
}

@injectable()
export class GridFeedbackCommand extends Command {
  static readonly KIND = 'gridFeedback';
  static readonly CSS_CLASS = 'grid';

  protected show: boolean;

  constructor(@inject(TYPES.Action) protected readonly action: GridFeedbackAction) {
    super();
  }

  execute(context: CommandExecutionContext): GModelRoot {
    this.show = this.action.show;
    return this.redo(context);
  }

  undo(context: CommandExecutionContext): GModelRoot {
    this.toggleGrid(context.root, !this.show);
    return context.root;
  }

  redo(context: CommandExecutionContext): GModelRoot {
    this.toggleGrid(context.root, this.show);
    return context.root;
  }

  private toggleGrid(root: GModelRoot, show: boolean): void {
    if (show) {
      addCssClass(root, GridFeedbackCommand.CSS_CLASS);
    } else {
      removeCssClass(root, GridFeedbackCommand.CSS_CLASS);
    }
  }
}
