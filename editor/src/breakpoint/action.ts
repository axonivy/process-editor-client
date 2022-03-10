import { injectable } from 'inversify';
import { Action, SModelElement } from 'sprotty';

import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action/quick-action';
import { isBreakable } from './model';

export class SetBreakpointAction implements Action {
  static readonly KIND = 'setBreakpoint';
  kind = SetBreakpointAction.KIND;

  constructor(public readonly elementId: string) {}
}

export class ToggleBreakpointAction implements Action {
  static readonly KIND = 'toggleBreakpoint';
  kind = ToggleBreakpointAction.KIND;

  constructor(public readonly elementId: string, public readonly disable: boolean) {}
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
    public readonly icon = 'fa-bug',
    public readonly title = 'Toggle Breakpoint',
    public readonly location = QuickActionLocation.Left,
    public readonly sorting = 'C',
    public readonly action = new SetBreakpointAction(elementId),
    public readonly readonlySupport = true
  ) {}
}
