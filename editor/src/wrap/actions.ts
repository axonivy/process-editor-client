import { Operation, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { KeyCode } from 'sprotty/lib/utils/keyboard';

import { MultipleQuickActionProvider, QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action/quick-action';
import { isUnwrapable } from './model';

export class WrapToSubOperation implements Operation {
  static readonly KIND = 'wrapToSub';

  constructor(public readonly elementIds: string[], public readonly kind: string = WrapToSubOperation.KIND) {}
}

export class UnwrapSubOperation implements Operation {
  static readonly KIND = 'unwrapSub';

  constructor(public readonly elementId: string, public readonly kind: string = UnwrapSubOperation.KIND) {}
}

@injectable()
export class UnwrapQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isUnwrapable(element)) {
      return new UnwrapQuickAction(element.id);
    }
    return undefined;
  }
}

class UnwrapQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = 'fa-expand-arrows-alt',
    public readonly title = 'Unwrap embedded subprocess (U)',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'B',
    public readonly action = new UnwrapSubOperation(elementId),
    public readonly shortcut: KeyCode = 'KeyU'
  ) {}
}

@injectable()
export class WrapQuickActionProvider extends MultipleQuickActionProvider {
  multiQuickAction(elements: SModelElement[]): QuickAction | undefined {
    const elementIds = elements.map(e => e.id);
    if (elementIds.length > 0) {
      return new WrapQuickAction(elementIds);
    }
    return undefined;
  }
}

class WrapQuickAction implements QuickAction {
  constructor(
    public readonly elementIds: string[],
    public readonly icon = 'fa-compress-arrows-alt',
    public readonly title = 'Wrap to embedded process (S)',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'B',
    public readonly action = new WrapToSubOperation(elementIds),
    public readonly shortcut: KeyCode = 'KeyS'
  ) {}
}
