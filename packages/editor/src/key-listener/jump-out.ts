import { inject } from 'inversify';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { Action, KeyListener, SModelElement, TYPES } from '@eclipse-glsp/client';
import { SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';
import { JumpAction } from '@axonivy/process-editor-protocol';

export class JumpOutKeyListener extends KeyListener {
  @inject(TYPES.SelectionService) protected selectionService: SelectionService;
  @inject(QuickActionUI) protected quickActionUi: QuickActionUI;

  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'KeyJ') && this.isJumpOutActive()) {
      return [JumpAction.create({ elementId: '' })];
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
