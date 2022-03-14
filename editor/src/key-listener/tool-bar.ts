import { KeyListener, Action, SModelElement } from 'sprotty';
import { inject } from 'inversify';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { GLSP_TYPES } from '@eclipse-glsp/client';
import { SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { JumpAction } from '../jump/action';
import { QuickActionUI } from '../quick-action/quick-action-ui';

export class ToolBarKeyListener extends KeyListener {
  @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;
  @inject(QuickActionUI) protected quickActionUi: QuickActionUI;

  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'KeyJ') && this.isJumpOutActive()) {
      return [new JumpAction('')];
    } else {
      return [];
    }
  }

  private isJumpOutActive(): boolean {
    return this.selectionService.getModelRoot().id.includes('-') && !this.isJumpIntoActive();
  }

  private isJumpIntoActive(): boolean {
    return this.quickActionUi
      .getActiveQuickActions()
      .map(quickAction => quickAction.action)
      .map(action => action.kind)
      .some(kind => kind === 'jumpInto');
  }
}
