import { Action } from '@eclipse-glsp/protocol';

export interface OpenInsertExtensionAction extends Action {
  kind: typeof OpenInsertExtensionAction.KIND;
}

export namespace OpenInsertExtensionAction {
  export const KIND = 'openInsertExtension';

  export function create(): OpenInsertExtensionAction {
    return {
      kind: KIND
    };
  }
}
