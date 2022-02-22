import { FeedbackCommand } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { Action, CommandExecutionContext, CommandReturn, SModelRoot, TYPES, UIExtensionRegistry } from 'sprotty';

import { CustomIconToggleActionHandler } from '../diagram/icon/custom-icon-toggle-action-handler';
import { ToolBar } from './tool-bar';

export class ToolBarFeedbackAction implements Action {
  constructor(readonly elementId?: string, public readonly kind: string = ToolBarFeedbackCommand.KIND) {}
}

@injectable()
export class ToolBarFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'toolPaletteFeedback';

  @inject(TYPES.Action) protected action: ToolBarFeedbackAction;
  @inject(TYPES.UIExtensionRegistry) private registry: UIExtensionRegistry;
  @inject(CustomIconToggleActionHandler) private handler: CustomIconToggleActionHandler;

  execute(context: CommandExecutionContext): CommandReturn {
    const toolPalette = this.registry.get(ToolBar.ID) as ToolBar;
    const root = context.root;
    toolPalette.showJumpOutBtn(this.showJumpOutBtn(root));
    toolPalette.toggleCustomIconBtn(this.showCustomIcons(root));
    return context.root;
  }

  showJumpOutBtn(root: SModelRoot): boolean {
    return root.id.includes('-');
  }

  showCustomIcons(root: SModelRoot): boolean {
    return this.handler.isShowCustomIcons;
  }
}
