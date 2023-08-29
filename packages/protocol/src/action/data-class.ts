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
}
