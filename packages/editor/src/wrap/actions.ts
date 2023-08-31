import { SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { StreamlineIcons } from '../StreamlineIcons';

import { QuickActionProvider, QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isSingleWrapable, isUnwrapable, isWrapable } from './model';
import { UnwrapSubOperation, WrapToSubOperation } from '@axonivy/process-editor-protocol';

@injectable()
export class UnwrapQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isUnwrapable(element)) {
      return {
        icon: StreamlineIcons.Unwrap,
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
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isSingleWrapable(element)) {
      return this.quickAction([element.id]);
    }
    return undefined;
  }

  multiQuickAction(elements: SModelElement[]): QuickAction | undefined {
    const elementIds = elements.map(e => e.id);
    if (elementIds.length > 0 && !elements.find(element => !isWrapable(element))) {
      return this.quickAction(elementIds);
    }
    return undefined;
  }

  quickAction(elementIds: string[]): QuickAction {
    return {
      icon: StreamlineIcons.WrapToSubprocess,
      title: 'Wrap to embedded process (W)',
      location: 'Middle',
      sorting: 'B',
      action: WrapToSubOperation.create({ elementIds }),
      shortcut: 'KeyW'
    };
  }
}