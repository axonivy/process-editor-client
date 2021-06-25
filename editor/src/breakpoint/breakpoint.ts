import { Action, findParentByFeature, isOpenable, MouseListener, SModelElement } from 'sprotty';

export class BreakpointAction implements Action {
  static readonly KIND = 'toggleBreakpoint';
  kind = BreakpointAction.KIND;

  constructor(public readonly elementId: string) {
  }
}

export class BreakpointListener extends MouseListener {
  doubleClick(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
    const openableTarget = findParentByFeature(target, isOpenable);
    if (openableTarget !== undefined) {
      return [new BreakpointAction(openableTarget.id)];
    }
    return [];
  }
}

export function isBreakpointAction(action: Action): action is BreakpointAction {
  return action !== undefined && (action.kind === BreakpointAction.KIND)
    && (action as BreakpointAction).elementId !== undefined;
}
