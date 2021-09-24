import { Operation, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

import { QuickAction, QuickActionHandleLocation, QuickActionProvider } from '../quick-action/quick-action';
import { isUnwrapable } from './model';

export class WrapToSubOperation implements Operation {
  static readonly KIND = 'wrapToSub';

  constructor(public readonly elementIds: string[],
    public readonly kind: string = WrapToSubOperation.KIND) { }
}

export class UnwrapSubOperation implements Operation {
  static readonly KIND = 'unwrapSub';

  constructor(public readonly elementId: string,
    public readonly kind: string = UnwrapSubOperation.KIND) { }
}

@injectable()
export class UnwrapQuickActionProvider implements QuickActionProvider {
  quickActionForElement(element: SModelElement): QuickAction | undefined {
    if (isUnwrapable(element)) {
      return new UnwrapQuickAction(element.id);
    }
    return undefined;
  }
}

class UnwrapQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-expand-arrows-alt',
    public readonly title = 'Unwrap embedded subprocess',
    public readonly location = QuickActionHandleLocation.BottomLeft,
    public readonly sorting = 'B',
    public readonly action = new UnwrapSubOperation(elementId)) {
  }
}
