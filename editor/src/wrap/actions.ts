import { Operation, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { KeyCode } from 'sprotty/lib/utils/keyboard';

import { MultipleQuickActionProvider, QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action/quick-action';
import { isUnwrapable } from './model';

export interface WrapToSubOperation extends Operation {
  kind: typeof WrapToSubOperation.KIND;
  elementIds: string[];
}

export namespace WrapToSubOperation {
  export const KIND = 'wrapToSub';

  export function create(options: { elementIds: string[] }): WrapToSubOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

export interface UnwrapSubOperation extends Operation {
  kind: typeof UnwrapSubOperation.KIND;
  elementId: string;
}

export namespace UnwrapSubOperation {
  export const KIND = 'unwrapSub';

  export function create(options: { elementId: string }): UnwrapSubOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
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
    public readonly icon = 'fa-solid fa-maximize',
    public readonly title = 'Unwrap embedded subprocess (U)',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'B',
    public readonly action = UnwrapSubOperation.create({ elementId }),
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
    public readonly icon = 'fa-solid fa-minimize',
    public readonly title = 'Wrap to embedded process (S)',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'B',
    public readonly action = WrapToSubOperation.create({ elementIds: elementIds }),
    public readonly shortcut: KeyCode = 'KeyS'
  ) {}
}
