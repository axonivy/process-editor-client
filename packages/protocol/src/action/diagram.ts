import { Action, hasBooleanProp } from '@eclipse-glsp/protocol';

export interface ShowGridAction extends Action {
  kind: typeof ShowGridAction.KIND;
  show: boolean;
}

export namespace ShowGridAction {
  export const KIND = 'showGridAction';

  export function is(object: any): object is ShowGridAction {
    return Action.hasKind(object, KIND) && hasBooleanProp(object, 'show');
  }

  export function create(options: { show: boolean }): ShowGridAction {
    return {
      kind: KIND,
      ...options
    };
  }
}
