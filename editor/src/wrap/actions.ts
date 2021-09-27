import { Operation, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

import {
  MultipleQuickActionProvider,
  QuickAction,
  QuickActionLocation,
  SingleQuickActionProvider
} from '../quick-action/quick-action';
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
export class UnwrapQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
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
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'B',
    public readonly action = new UnwrapSubOperation(elementId)) {
  }
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
  constructor(public readonly elementIds: string[],
    public readonly icon = 'fa-compress-arrows-alt',
    public readonly title = 'Wrap to embedded process',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'B',
    public readonly action = new WrapToSubOperation(elementIds)) {
  }
}
