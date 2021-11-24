import { Action, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action/quick-action';
import { isJumpable } from './model';

export class JumpAction implements Action {
  static readonly KIND = 'jumpInto';

  constructor(public readonly elementId: string, public readonly kind: string = JumpAction.KIND) {}
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
    public readonly icon = 'fa-level-down-alt',
    public readonly title = 'Jump',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'A',
    public readonly action = new JumpAction(elementId)
  ) {}
}
