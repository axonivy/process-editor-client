import { Action, hasBooleanProp } from '@eclipse-glsp/protocol';

export interface CustomIconToggleAction extends Action {
  kind: typeof CustomIconToggleAction.KIND;
  showCustomIcons: boolean;
}

export namespace CustomIconToggleAction {
  export const KIND = 'toggleCustomIcons';

  export function is(object: any): object is CustomIconToggleAction {
    return Action.hasKind(object, KIND) && hasBooleanProp(object, 'showCustomIcons');
  }

  export function create(options: { showCustomIcons: boolean }): CustomIconToggleAction {
    return {
      kind: KIND,
      ...options
    };
  }
}
