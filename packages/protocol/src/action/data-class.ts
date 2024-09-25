import { Action } from '@eclipse-glsp/protocol';

export interface OpenDataClassAction extends Action {
  kind: typeof OpenDataClassAction.KIND;
}

export namespace OpenDataClassAction {
  export const KIND = 'openDataClassEditor';

  export function create(): OpenDataClassAction {
    return {
      kind: KIND
    };
  }

  export function is(object: any): object is OpenDataClassAction {
    return Action.hasKind(object, KIND);
  }
}
