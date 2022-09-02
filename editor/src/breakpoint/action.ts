import { injectable } from 'inversify';
import { Action, SModelElement } from '@eclipse-glsp/client';
import { KeyCode } from 'sprotty/lib/utils/keyboard';

import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isBreakable } from './model';
import { StreamlineIcons } from '../StreamlineIcons';

export interface SetBreakpointAction extends Action {
  kind: typeof SetBreakpointAction.KIND;
  elementId: string;
}

export namespace SetBreakpointAction {
  export const KIND = 'setBreakpoint';

  export function create(options: { elementId: string }): SetBreakpointAction {
    return {
      kind: KIND,
      ...options
    };
  }
}

export interface ToggleBreakpointAction extends Action {
  kind: typeof ToggleBreakpointAction.KIND;
  elementId: string;
  disable: boolean;
}

export namespace ToggleBreakpointAction {
  export const KIND = 'toggleBreakpoint';

  export function create(options: { elementId: string; disable: boolean }): ToggleBreakpointAction {
    return {
      kind: KIND,
      ...options
    };
  }
}

@injectable()
export class BreakpointQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isBreakable(element)) {
      return new BreakpointQuickAction(element.id);
    }
    return undefined;
  }
}

class BreakpointQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = StreamlineIcons.Bug,
    public readonly title = 'Toggle Breakpoint (B)',
    public readonly location = QuickActionLocation.Left,
    public readonly sorting = 'C',
    public readonly action = SetBreakpointAction.create({ elementId: elementId }),
    public readonly letQuickActionsOpen = true,
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyB'
  ) {}
}
