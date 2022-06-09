import { Action, hasStringProp, IActionHandler, SModelElement } from '@eclipse-glsp/client';
import { SelectAllAction } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { KeyCode } from 'sprotty/lib/utils/keyboard';

import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action/quick-action';
import { isJumpable } from './model';

export interface JumpAction extends Action {
  kind: typeof JumpAction.KIND;
  elementId: string;
}

export namespace JumpAction {
  export const KIND = 'jumpInto';

  export function create(options: { elementId: string }): JumpAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function is(object: any): object is JumpAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId');
  }
}

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
      return new JumpQuickAction(element.id);
    }
    return undefined;
  }
}

class JumpQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = 'fa-solid fa-turn-down',
    public readonly title = 'Jump (J)',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'A',
    public readonly action = JumpAction.create({ elementId: elementId }),
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyJ'
  ) {}
}
