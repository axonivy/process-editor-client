import { KeyListener, Action, SModelElement } from '@eclipse-glsp/client';
import { inject } from 'inversify';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';

export class QuickActionKeyListener extends KeyListener {
  @inject(QuickActionUI) protected quickActionUi: QuickActionUI;

  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    return this.quickActionUi
      .getActiveQuickActions()
      .filter(quickAction => quickAction.shortcut && matchesKeystroke(event, quickAction.shortcut))
      .map(quickAction => quickAction.action);
  }
}
