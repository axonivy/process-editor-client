import 'reflect-metadata';

import { injectable } from 'inversify';
import { Action, SModelElement } from 'sprotty';

import { QuickAction, QuickActionHandleLocation, QuickActionProvider } from '../quick-action/model';
import { isBreakable } from './model';

export class BreakpointAction implements Action {
  static readonly KIND = 'toggleBreakpoint';
  kind = BreakpointAction.KIND;

  constructor(public readonly elementId: string) {
  }
}

export function isBreakpointAction(action: Action): action is BreakpointAction {
  return action !== undefined && (action.kind === BreakpointAction.KIND)
    && (action as BreakpointAction).elementId !== undefined;
}

@injectable()
export class BreakpointQuickActionProvider implements QuickActionProvider {
  quickActionForElement(element: SModelElement): QuickAction | undefined {
    if (isBreakable(element)) {
      return new BreakpointQuickAction(element.id);
    }
    return undefined;
  }
}

class BreakpointQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-bug',
    public readonly location = QuickActionHandleLocation.Left,
    public readonly sorting = 'C',
    public readonly action = new BreakpointAction(elementId)) {
  }
}
