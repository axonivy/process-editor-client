import { FeedbackCommand } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { Action, CommandExecutionContext, CommandReturn, SModelRoot, TYPES, UIExtensionRegistry } from 'sprotty';

import { CustomIconToggleActionHandler } from '../diagram/icon/custom-icon-toggle-action-handler';
import { ToolPalette } from './tool-palette';

export class ToolPaletteFeedbackAction implements Action {
  constructor(readonly elementId?: string, public readonly kind: string = ToolPaletteFeedbackCommand.KIND) { }
}

@injectable()
export class ToolPaletteFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'toolPaletteFeedback';

  @inject(TYPES.Action) protected action: ToolPaletteFeedbackAction;
  @inject(TYPES.UIExtensionRegistry) private registry: UIExtensionRegistry;
  @inject(CustomIconToggleActionHandler) private handler: CustomIconToggleActionHandler;

  execute(context: CommandExecutionContext): CommandReturn {
    const toolPalette = this.registry.get(ToolPalette.ID) as ToolPalette;
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
