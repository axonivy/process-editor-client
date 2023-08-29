import { Action } from '@eclipse-glsp/protocol';

export interface OpenQuickOutlineAction extends Action {
  kind: typeof OpenQuickOutlineAction.KIND;
}

export namespace OpenQuickOutlineAction {
  export const KIND = 'openQuickOutline';

  export function create(): OpenQuickOutlineAction {
    return {
      kind: KIND
    };
  }
}
