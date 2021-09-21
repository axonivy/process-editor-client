import { Operation, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

import { QuickAction, QuickActionHandleLocation, QuickActionProvider } from '../quick-action/model';
import { isUnWrapable } from './model';

export class WrapToSubOperation implements Operation {
  static readonly KIND = 'wrapToSub';

  constructor(public readonly elementIds: string[],
    public readonly kind: string = WrapToSubOperation.KIND) { }
}

export class UnWrapSubOperation implements Operation {
  static readonly KIND = 'unWrapSub';

  constructor(public readonly elementIds: string,
    public readonly kind: string = UnWrapSubOperation.KIND) { }
}

@injectable()
export class UnWrapQuickActionProvider implements QuickActionProvider {
  quickActionForElement(element: SModelElement): QuickAction | undefined {
    if (isUnWrapable(element)) {
      return new UnWrapQuickAction(element.id);
    }
    return undefined;
  }
}

class UnWrapQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-expand-arrows-alt',
    public readonly location = QuickActionHandleLocation.BottomLeft,
    public readonly sorting = 'B',
    public readonly action = new UnWrapSubOperation(elementId)) {
  }
}
