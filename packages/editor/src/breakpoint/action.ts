import { injectable } from 'inversify';
import { SModelElement } from '@eclipse-glsp/client';

import { QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isBreakable } from './model';
import { StreamlineIcons } from '../StreamlineIcons';
import { SetBreakpointAction } from '@axonivy/process-editor-protocol';

@injectable()
export class BreakpointQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isBreakable(element)) {
      return {
        icon: StreamlineIcons.Bug,
        title: 'Toggle Breakpoint (B)',
        location: 'Left',
        sorting: 'C',
        action: SetBreakpointAction.create({ elementId: element.id }),
        letQuickActionsOpen: true,
        readonlySupport: true,
        shortcut: 'KeyB'
      };
    }
    return undefined;
  }
}
