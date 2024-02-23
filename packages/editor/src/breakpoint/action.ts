import { injectable } from 'inversify';
import { GModelElement } from '@eclipse-glsp/client';

import { QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isBreakable } from './model';
import { IvyIcons } from '@axonivy/ui-icons';
import { SetBreakpointAction } from '@axonivy/process-editor-protocol';

@injectable()
export class BreakpointQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isBreakable(element)) {
      return {
        icon: IvyIcons.Bug,
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
