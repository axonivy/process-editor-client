import { FeedbackCommand } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { Action, CommandExecutionContext, CommandReturn, SModelRoot, TYPES, UIExtensionRegistry } from 'sprotty';

import { ToolPalette } from './tool-palette';

export class ShowJumpOutToolFeedbackAction implements Action {
  constructor(readonly elementId?: string, public readonly kind: string = ShowJumpOutToolFeedbackCommand.KIND) { }
}

@injectable()
export class ShowJumpOutToolFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'showJumpOutToolFeedback';

  @inject(TYPES.Action) protected action: ShowJumpOutToolFeedbackAction;
  @inject(TYPES.UIExtensionRegistry) private registry: UIExtensionRegistry;

  execute(context: CommandExecutionContext): CommandReturn {
    const toolPalette = this.registry.get(ToolPalette.ID) as ToolPalette;
    const root = context.root;
    if (this.showJumpOutBtn(root)) {
      toolPalette.showJumpOutBtn();
    } else {
      toolPalette.hideJumpOutBtn();
    }
    return context.root;
  }

  showJumpOutBtn(root: SModelRoot): boolean {
    return root.id.includes('-');
  }
}
