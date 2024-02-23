import { GModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { IvyIcons } from '@axonivy/ui-icons';

import { QuickActionProvider, QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isSingleWrapable, isUnwrapable, isWrapable } from './model';
import { UnwrapSubOperation, WrapToSubOperation } from '@axonivy/process-editor-protocol';

@injectable()
export class UnwrapQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isUnwrapable(element)) {
      return {
        icon: IvyIcons.Unwrap,
        title: 'Unwrap embedded subprocess (U)',
        location: 'Middle',
        sorting: 'B',
        action: UnwrapSubOperation.create({ elementId: element.id }),
        shortcut: 'KeyU'
      };
    }
    return undefined;
  }
}

@injectable()
export class WrapQuickActionProvider implements QuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isSingleWrapable(element)) {
      return this.quickAction([element.id]);
    }
    return undefined;
  }

  multiQuickAction(elements: GModelElement[]): QuickAction | undefined {
    const elementIds = elements.map(e => e.id);
    if (elementIds.length > 0 && !elements.find(element => !isWrapable(element))) {
      return this.quickAction(elementIds);
    }
    return undefined;
  }

  quickAction(elementIds: string[]): QuickAction {
    return {
      icon: IvyIcons.WrapToSubprocess,
      title: 'Wrap to embedded process (W)',
      location: 'Middle',
      sorting: 'B',
      action: WrapToSubOperation.create({ elementIds }),
      shortcut: 'KeyW'
    };
  }
}
