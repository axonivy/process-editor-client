import {
  FeedbackCommand,
  Action,
  CommandExecutionContext,
  CommandReturn,
  SModelRoot,
  TYPES,
  UIExtensionRegistry
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

import { CustomIconToggleActionHandler } from '../diagram/icon/custom-icon-toggle-action-handler';
import { ToolBar } from './tool-bar';

export interface ToolBarFeedbackAction extends Action {
  kind: typeof ToolBarFeedbackCommand.KIND;
  elementId?: string;
}

export namespace ToolBarFeedbackAction {
  export function create(elementId?: string): ToolBarFeedbackAction {
    return {
      kind: ToolBarFeedbackCommand.KIND,
      elementId
    };
  }
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
