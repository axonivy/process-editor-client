import { Action, IActionHandler, SModelElement } from '@eclipse-glsp/client';
import { SelectAllAction } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { IvyIcons } from '@axonivy/editor-icons/lib';

import { QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isJumpable } from './model';
import { JumpAction } from '@axonivy/process-editor-protocol';

@injectable()
export class JumpActionHandler implements IActionHandler {
  handle(action: Action): Action | void {
    if (JumpAction.is(action)) {
      return SelectAllAction.create(false);
    }
  }
}

@injectable()
export class JumpQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isJumpable(element)) {
      return {
        icon: IvyIcons.Jump,
        title: 'Jump (J)',
        location: 'Middle',
        sorting: 'A',
        action: JumpAction.create({ elementId: element.id }),
        readonlySupport: true,
        shortcut: 'KeyJ'
      };
    }
    return undefined;
  }
}
